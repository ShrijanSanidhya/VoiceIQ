import os
import hashlib
import logging
from typing import Dict, Any, List
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import HumanMessage, SystemMessage, AIMessage

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

load_dotenv()

# ---------------------------------------------------------
# 1. Initialize LangChain
# ---------------------------------------------------------
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    logger.error("API key missing error: GEMINI_API_KEY is not set.")

# Use Gemini Flash as the LLM (fast, free via Google AI Studio)
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)

# Use HuggingFace embeddings (100% free, runs locally)
# sentence-transformers/all-MiniLM-L6-v2 is an excellent small/fast model.
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Save vector store in memory (cache) so we don't re-embed the same transcript repeatedly
_vectorstore_cache = {}

# ---------------------------------------------------------
# 2. Create Vector Store Function
# ---------------------------------------------------------
def create_vectorstore(transcript: str):
    """
    Splits the transcript into chunks (size 500, overlap 50), embeds them locally 
    using HuggingFace, and stores them in an in-memory FAISS vector store.
    """
    if not transcript or not transcript.strip():
        raise ValueError("Empty transcript error")

    # Use hash of the transcript as the cache key to persist in memory
    transcript_hash = hashlib.md5(transcript.encode()).hexdigest()
    if transcript_hash in _vectorstore_cache:
        logger.info("Returning cached FAISS vector store.")
        return _vectorstore_cache[transcript_hash]

    logger.info("Creating new FAISS vector store from transcript...")
    
    # Split transcript into chunks of 500 characters with 50 characters overlap
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    
    chunks = text_splitter.split_text(transcript)
    if not chunks:
        raise ValueError("Empty transcript error: could not extract chunks")
        
    # Create FAISS vector store locally using HuggingFace embeddings
    vectorstore = FAISS.from_texts(chunks, embeddings)
    
    # Save vector store in memory
    _vectorstore_cache[transcript_hash] = vectorstore
    
    return vectorstore

# ---------------------------------------------------------
# 3. Chat with Transcript Function
# ---------------------------------------------------------
def chat_with_transcript(question: str, transcript: str, chat_history: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Loads/creates a vector store from the transcript, finds relevant chunks,
    and uses Gemini to answer the question contextually with RAG.
    Maintains a chat history of up to 10 messages.
    """
    # 5. Error Handling
    if not question or not question.strip():
        raise ValueError("Question is empty")
    if len(question) > 1000:
        raise ValueError("Question too long error")
    if not transcript or not transcript.strip():
        raise ValueError("Empty transcript error")

    # Load or create vector store from transcript
    vectorstore = create_vectorstore(transcript)
    
    # Find relevant chunks for question (retrieve top 3 results)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(question)
    
    if not docs:
        raise ValueError("No relevant context found error")
        
    # Combine retrieved documents into a single context string
    context = "\n".join([doc.page_content for doc in docs])
    
    # 4. Maintain Chat History (Keep last 10 messages)
    history_messages = []
    recent_history = chat_history[-10:] if chat_history else []
    
    for msg in recent_history:
        if msg.get("role") == "user":
            history_messages.append(HumanMessage(content=msg.get("content", "")))
        elif msg.get("role") == "assistant":
            history_messages.append(AIMessage(content=msg.get("content", "")))
            
    # Construct the final prompt with context
    system_prompt = f"""You are a helpful assistant answering questions based strictly on the provided transcript context.
If the answer is not contained in the context, say you don't know based on the transcript.

Context:
{context}"""
    
    # Send to Gemini with context and history
    messages = [SystemMessage(content=system_prompt)] + history_messages + [HumanMessage(content=question)]
    
    logger.info("Sending RAG query to Gemini...")
    response = llm.invoke(messages)
    
    # Note: LangChain/Gemini Flash doesn't return a strict native confidence score.
    # We provide a fixed mock 0.85 per requirements.
    return {
        "answer": response.content,
        "sources": [doc.page_content for doc in docs],
        "confidence": 0.85 
    }
