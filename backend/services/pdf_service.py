import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.units import inch

# Deep purple + cyan colors for the brand
BRAND_PURPLE = colors.HexColor("#4c1d95")
BRAND_CYAN = colors.HexColor("#06b6d4")
BRAND_LIGHT_PURPLE = colors.HexColor("#f5f3ff")
BRAND_DARK = colors.HexColor("#0f172a")
BRAND_GRAY = colors.HexColor("#64748b")

# Base font setups
# ReportLab includes Helvetica by default which is clean and professional

# ---------------------------------------------------------
# 1. Background and Header/Footer Callbacks
# ---------------------------------------------------------
def draw_cover_bg(canvas_obj, doc):
    """Draws the gradient-like solid block background for the cover page."""
    canvas_obj.saveState()
    # Draw a large purple rectangle at the top
    canvas_obj.setFillColor(BRAND_PURPLE)
    canvas_obj.rect(0, 4.5 * inch, 8.5 * inch, 6.5 * inch, fill=True, stroke=False)
    # Draw a cyan accent line below the purple box
    canvas_obj.setFillColor(BRAND_CYAN)
    canvas_obj.rect(0, 4.3 * inch, 8.5 * inch, 0.2 * inch, fill=True, stroke=False)
    canvas_obj.restoreState()

def draw_header_footer(canvas_obj, doc):
    """Draws the VoiceIQ logo/header and page numbers on every subsequent page."""
    canvas_obj.saveState()
    
    # Header
    canvas_obj.setFont('Helvetica-Bold', 14)
    canvas_obj.setFillColor(BRAND_PURPLE)
    canvas_obj.drawString(inch, 10.5 * inch, "VoiceIQ")
    
    canvas_obj.setFont('Helvetica', 10)
    canvas_obj.setFillColor(BRAND_GRAY)
    canvas_obj.drawString(inch + 65, 10.5 * inch, "| AI-Powered Audio Analysis Report")
    
    # Footer with Page Number
    canvas_obj.setFont('Helvetica', 9)
    canvas_obj.setFillColor(BRAND_GRAY)
    canvas_obj.drawRightString(7.5 * inch, 0.5 * inch, f"Page {doc.page}")
    
    canvas_obj.restoreState()

# NOTE: In Platypus (ReportLab's flowable engine), we append "flowables" (like Paragraphs) 
# to a list (story) which automatically handles page breaks. 
# The variable name `canvas` in the functions below represents this `story` list 
# to adhere to the requested function signatures while still getting automatic page breaks.

# ---------------------------------------------------------
# 2. Cover Page
# ---------------------------------------------------------
def create_cover_page(canvas, data):
    """Generates the Cover Page with VoiceIQ title, file info, and timestamp."""
    # Push content down into the purple box
    canvas.append(Spacer(1, 1.5 * inch))
    
    title_style = ParagraphStyle('CoverTitle', fontSize=42, textColor=colors.white, fontName='Helvetica-Bold', spaceAfter=10)
    subtitle_style = ParagraphStyle('CoverSub', fontSize=18, textColor=BRAND_CYAN, fontName='Helvetica', spaceAfter=40)
    info_style = ParagraphStyle('CoverInfo', fontSize=12, textColor=colors.white, spaceAfter=10)
    
    canvas.append(Paragraph("VoiceIQ", title_style))
    canvas.append(Paragraph("AI-Powered Audio Analysis Report", subtitle_style))
    
    canvas.append(Spacer(1, 0.5 * inch))
    canvas.append(Paragraph(f"<b>Analyzed File:</b> {data.get('filename', 'Unknown')}", info_style))
    canvas.append(Paragraph(f"<b>Generated:</b> {data.get('date', '')}", info_style))
    canvas.append(Paragraph(f"<b>Total Duration:</b> {data.get('duration', '0')} seconds", info_style))
    canvas.append(Paragraph(f"<b>Detected Language:</b> {data.get('language', 'Unknown')}", info_style))
    canvas.append(Paragraph(f"<b>Speakers Detected:</b> {data.get('speakers_count', 0)}", info_style))
    
    canvas.append(PageBreak())

# ---------------------------------------------------------
# 3. Executive Summary Section
# ---------------------------------------------------------
def create_summary_section(canvas, data):
    """Generates the Executive Summary section with bullet points and a purple left border."""
    section_title = ParagraphStyle('SectionTitle', fontSize=18, textColor=BRAND_PURPLE, fontName='Helvetica-Bold', spaceAfter=15)
    
    # We use a Table to create the purple left border effect easily in ReportLab
    one_line_style = ParagraphStyle('OneLine', fontSize=14, textColor=BRAND_DARK, fontName='Helvetica-Bold')
    t_summary = Table([[Paragraph(data.get('one_line_summary', ''), one_line_style)]], colWidths=[6.5*inch])
    t_summary.setStyle(TableStyle([
        ('LINELEFT', (0,0), (0,-1), 3, BRAND_PURPLE),
        ('LEFTPADDING', (0,0), (0,-1), 10),
        ('BOTTOMPADDING', (0,0), (0,-1), 5),
    ]))
    
    bullet_style = ParagraphStyle('Bullet', fontSize=11, textColor=BRAND_DARK, leftIndent=20, spaceAfter=8)
    
    canvas.append(Paragraph("Executive Summary", section_title))
    canvas.append(t_summary)
    canvas.append(Spacer(1, 15))
    
    for point in data.get('summary', []):
        canvas.append(Paragraph(f"<font color='{BRAND_CYAN}'>•</font> {point}", bullet_style))
        
    canvas.append(Spacer(1, 20))

# ---------------------------------------------------------
# 4. Key Highlights Section
# ---------------------------------------------------------
def create_highlights_section(canvas, data):
    """Generates the Key Highlights section with numbered cyan items."""
    section_title = ParagraphStyle('SectionTitle', fontSize=18, textColor=BRAND_PURPLE, fontName='Helvetica-Bold', spaceAfter=15)
    highlight_style = ParagraphStyle('Highlight', fontSize=11, textColor=BRAND_DARK, leftIndent=10, spaceAfter=12)
    
    canvas.append(Paragraph("Key Highlights", section_title))
    
    highlights = data.get('key_highlights', [])
    for i, hl in enumerate(highlights, 1):
        num_str = f"0{i}" if i < 10 else str(i)
        text = f"<font color='{BRAND_CYAN}'><b>{num_str}.</b></font> {hl}"
        canvas.append(Paragraph(text, highlight_style))
        
    canvas.append(Spacer(1, 20))

# ---------------------------------------------------------
# 5. Action Items Section
# ---------------------------------------------------------
def create_action_items_section(canvas, data):
    """Generates Action Items with a checkbox style list and light purple background."""
    section_title = ParagraphStyle('SectionTitle', fontSize=18, textColor=BRAND_PURPLE, fontName='Helvetica-Bold', spaceAfter=15)
    canvas.append(Paragraph("Action Items", section_title))
    
    action_items = data.get('action_items', [])
    for item in action_items:
        # Checkbox symbol '□'
        p = Paragraph(f"□  {item}", ParagraphStyle('Action', fontSize=11, textColor=BRAND_DARK))
        t = Table([[p]], colWidths=[6.5*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BRAND_LIGHT_PURPLE),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMMARGIN', (0,0), (-1,-1), 5),
        ]))
        canvas.append(t)
        canvas.append(Spacer(1, 5))
        
    canvas.append(Spacer(1, 20))

# ---------------------------------------------------------
# 6. Sentiment Analysis Section
# ---------------------------------------------------------
def create_sentiment_section(canvas, data):
    """Generates the Sentiment Analysis visual bar breakdown and overall score."""
    section_title = ParagraphStyle('SectionTitle', fontSize=18, textColor=BRAND_PURPLE, fontName='Helvetica-Bold', spaceAfter=15)
    canvas.append(Paragraph("Sentiment Analysis", section_title))
    
    overall = data.get('overall', 'Neutral').lower()
    emoji = "✅" if overall == 'positive' else "❌" if overall == 'negative' else "⚠️"
    
    overall_style = ParagraphStyle('SentimentOverall', fontSize=14, fontName='Helvetica-Bold', spaceAfter=15)
    canvas.append(Paragraph(f"{emoji} Overall Sentiment: {overall.capitalize()}", overall_style))
    
    emotions = data.get('emotions', {})
    bar_style = ParagraphStyle('SentimentBar', fontSize=11, fontName='Courier', spaceAfter=8)
    
    # Visual bar representation
    for emotion, score in emotions.items():
        percent = int(score * 100)
        filled_blocks = int(score * 10)
        empty_blocks = 10 - filled_blocks
        bar = "█" * filled_blocks + "░" * empty_blocks
        
        # We use a table to align the emotion text and the bar
        label_p = Paragraph(f"<b>{emotion.capitalize()}</b>", ParagraphStyle('EmoL', fontSize=11, textColor=BRAND_DARK))
        bar_p = Paragraph(f"<font color='{BRAND_CYAN}'>{bar}</font> {percent}%", bar_style)
        
        t = Table([[label_p, bar_p]], colWidths=[1.5*inch, 5*inch])
        t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
        canvas.append(t)
        
    canvas.append(Spacer(1, 10))
    canvas.append(Paragraph(data.get('sentiment_summary', ''), ParagraphStyle('Norm', fontSize=11, textColor=BRAND_GRAY)))
    canvas.append(Spacer(1, 20))

# ---------------------------------------------------------
# 7. Chapters Section
# ---------------------------------------------------------
def create_chapters_section(canvas, data):
    """Generates the timeline style layout for chapters."""
    section_title = ParagraphStyle('SectionTitle', fontSize=18, textColor=BRAND_PURPLE, fontName='Helvetica-Bold', spaceAfter=15)
    canvas.append(Paragraph("Content Chapters", section_title))
    
    chapters = data.get('chapters', [])
    for chap in chapters:
        time_str = f"{chap.get('start_time', '00:00')} - {chap.get('end_time', '00:00')}"
        title = chap.get('title', 'Topic')
        summary = chap.get('summary', '')
        
        # Timeline style layout using Table borders
        t1 = Paragraph(f"<font color='{BRAND_PURPLE}'><b>{time_str}</b></font>", ParagraphStyle('ChapTime', fontSize=10))
        t2 = Paragraph(f"<b>{title}</b><br/><font color='{BRAND_GRAY}'>{summary}</font>", ParagraphStyle('ChapDesc', fontSize=11, spaceAfter=10))
        
        table = Table([[t1, t2]], colWidths=[1.5*inch, 5*inch])
        table.setStyle(TableStyle([
            ('LINELEFT', (1,0), (1,-1), 2, BRAND_PURPLE),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (1,0), (1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 15),
        ]))
        canvas.append(table)
        
    canvas.append(Spacer(1, 20))

# ---------------------------------------------------------
# 8. Full Transcript Section
# ---------------------------------------------------------
def create_transcript_section(canvas, data):
    """Generates the Full Transcript section with automatically handled page breaks."""
    section_title = ParagraphStyle('SectionTitle', fontSize=18, textColor=BRAND_PURPLE, fontName='Helvetica-Bold', spaceAfter=15)
    canvas.append(PageBreak())
    canvas.append(Paragraph("Full Transcript", section_title))
    
    transcript = data.get('transcript', '')
    speakers = data.get('speakers', [])
    
    p_style = ParagraphStyle('Transcript', fontSize=10, leading=14, spaceAfter=10, textColor=BRAND_DARK)
    
    if speakers:
        for spk in speakers:
            start_time = spk.get('start', 0)
            start_m = int(start_time // 60)
            start_s = int(start_time % 60)
            time_str = f"{start_m:02d}:{start_s:02d}"
            
            name = spk.get('speaker', 'Unknown')
            text = spk.get('text', '')
            
            line = f"<b><font color='{BRAND_PURPLE}'>{name}</font> <font color='{BRAND_CYAN}'>[{time_str}]</font>:</b> {text}"
            canvas.append(Paragraph(line, p_style))
    else:
        # Fallback if speaker alignment isn't passed
        canvas.append(Paragraph(transcript.replace('\n', '<br/>'), p_style))
        
    canvas.append(Spacer(1, 20))

# ---------------------------------------------------------
# 9. Chat History Section
# ---------------------------------------------------------
def create_chat_section(canvas, data):
    """Generates the Q&A Session section only if chat history exists."""
    chat_history = data.get('chat_history', [])
    if not chat_history:
        return
        
    section_title = ParagraphStyle('SectionTitle', fontSize=18, textColor=BRAND_PURPLE, fontName='Helvetica-Bold', spaceAfter=15)
    canvas.append(PageBreak())
    canvas.append(Paragraph("Q&A Session", section_title))
    
    for msg in chat_history:
        role = msg.get('role', 'user')
        content = msg.get('content', '')
        
        if role == 'user':
            # Purple bubble right aligned
            p = Paragraph(content, ParagraphStyle('UserMsg', fontSize=11, textColor=colors.white))
            t = Table([[p]], colWidths=[4.5*inch], hAlign='RIGHT')
            t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), BRAND_PURPLE),
                ('PADDING', (0,0), (-1,-1), 10),
            ]))
        else:
            # Light purple bubble left aligned
            p = Paragraph(content, ParagraphStyle('AIMsg', fontSize=11, textColor=BRAND_DARK))
            t = Table([[p]], colWidths=[4.5*inch], hAlign='LEFT')
            t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), BRAND_LIGHT_PURPLE),
                ('PADDING', (0,0), (-1,-1), 10),
            ]))
            
        canvas.append(t)
        canvas.append(Spacer(1, 10))

# ---------------------------------------------------------
# 10. Main Export Function
# ---------------------------------------------------------
def export_pdf(
    filename: str,
    transcript: str,
    summary: dict,
    sentiment: dict,
    chapters: list,
    speakers: list,
    chat_history: list
) -> str:
    """
    Combines all sections and generates the professional PDF report.
    Returns the file path of the saved PDF.
    """
    if not transcript:
        raise ValueError("Empty data error: Transcript cannot be empty.")
        
    try:
        os.makedirs("exports", exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"VoiceIQ_Report_{timestamp}.pdf"
        output_path = os.path.join("exports", output_filename)
        
        # Setup Platypus Document
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=inch,
            leftMargin=inch,
            topMargin=inch,
            bottomMargin=inch
        )
        
        story = [] # This is the "canvas" we pass to our section builders
        
        # Aggregate data neatly
        data = {
            "filename": filename,
            "date": datetime.now().strftime("%B %d, %Y at %I:%M %p"),
            "duration": "0", # Optionally calculate from timestamps
            "language": "en", # Fallback default
            "speakers_count": len(set(s.get('speaker') for s in speakers)) if speakers else 1,
            "transcript": transcript,
            "speakers": speakers,
            "chat_history": chat_history,
            "chapters": chapters,
            "sentiment_summary": sentiment.get("summary", ""), # Rename to avoid clash with summary dict
            **summary, # unpack summary, action_items, key_highlights, one_line_summary
            **sentiment, # overall, score, emotions
        }
        
        # Build document sequentially
        create_cover_page(story, data)
        create_summary_section(story, data)
        create_highlights_section(story, data)
        create_action_items_section(story, data)
        create_sentiment_section(story, data)
        create_chapters_section(story, data)
        create_transcript_section(story, data)
        create_chat_section(story, data)
        
        # Generate the PDF with custom headers and backgrounds
        doc.build(story, onFirstPage=draw_cover_bg, onLaterPages=draw_header_footer)
        
        return output_path
        
    except Exception as e:
        raise RuntimeError(f"PDF generation failed error: {str(e)}")
