from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, PageBreak, ListFlowable, ListItem

src = Path(r"c:\Users\dagia\OneDrive\Desktop\portfolio pj\chatbot_knowledge_base.txt")
out = Path(r"c:\Users\dagia\OneDrive\Desktop\portfolio pj\chatbot_knowledge_base.pdf")

text = src.read_text(encoding='utf-8')
text = text.replace('\r\n', '\n').replace('\r', '\n')

styles = getSampleStyleSheet()

cover_title = ParagraphStyle(
    'CoverTitle',
    parent=styles['Title'],
    fontName='Helvetica-Bold',
    fontSize=24,
    leading=30,
    textColor=colors.HexColor('#0f172a'),
    alignment=1,
    spaceAfter=10,
)

cover_subtitle = ParagraphStyle(
    'CoverSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=11,
    leading=18,
    textColor=colors.HexColor('#475569'),
    alignment=1,
    spaceAfter=20,
)

section_title = ParagraphStyle(
    'SectionTitle',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=18,
    textColor=colors.HexColor('#0f172a'),
    spaceBefore=16,
    spaceAfter=8,
    borderPadding=4,
)

body = ParagraphStyle(
    'BodyText',
    parent=styles['BodyText'],
    fontName='Helvetica',
    fontSize=10,
    leading=15,
    textColor=colors.HexColor('#1f2937'),
    spaceAfter=8,
)

small_bold = ParagraphStyle(
    'SmallBold',
    parent=body,
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=15,
)

bullet = ParagraphStyle(
    'Bullet',
    parent=body,
    leftIndent=18,
    bulletIndent=12,
    bulletFontName='Helvetica-Bold',
    bulletColor=colors.HexColor('#f97316'),
)

story = []

# Cover page
story.append(Spacer(1, 16 * mm))
story.append(Paragraph('<para align="center"><font name="Helvetica-Bold" size="26" color="#0f172a">SA TEACH STARTUP</font></para>', styles['Title']))
story.append(Paragraph('<para align="center"><font name="Helvetica-Bold" size="14" color="#f97316">CHATBOT KNOWLEDGE BASE</font></para>', styles['Normal']))
story.append(Spacer(1, 8 * mm))
story.append(Paragraph('<para align="center"><font name="Helvetica" size="12" color="#475569">Customer Support • Website Guidance • Security & Safety</font></para>', styles['Normal']))
story.append(Spacer(1, 10 * mm))

summary = [
    'Official support reference for website visitors, leads, and customer inquiries.',
    'Explains the brand, services, pages, contact process, and public communication rules.',
    'Protects the business from phishing, impersonation, and unsafe requests.',
]

for item in summary:
    story.append(Paragraph(f'<font name="Helvetica-Bold" color="#f97316">•</font> <font name="Helvetica" size="10">{item}</font>', body))

story.append(Spacer(1, 12 * mm))
story.append(Paragraph('<para align="center"><font name="Helvetica-Bold" size="10" color="#0f172a">Prepared for: Live website assistant and customer service support</font></para>', styles['Normal']))
story.append(PageBreak())

# Section extraction
sections = []
for chunk in re.split(r'(?=^PAGE\s+\d+:)', text, flags=re.M):
    chunk = chunk.strip()
    if not chunk:
        continue
    match = re.match(r'^PAGE\s+(\d+):\s*(.*)', chunk, flags=re.M | re.S)
    if match:
        page_no = match.group(1)
        title = match.group(2).strip()
        body_text = chunk[match.end():].strip()
    else:
        page_no = 'Overview'
        title = 'Overview'
        body_text = chunk

    body_text = re.sub(r'\n{3,}', '\n\n', body_text)
    sections.append((title, body_text))

# Add section content thoughtfully
for title, body_text in sections:
    if title.lower().startswith('purpose'):
        title = '1. Purpose of the Knowledge Base'
    if title.lower().startswith('brand'):
        title = '2. Brand Identity & Business Overview'
    if title.lower().startswith('website structure'):
        title = '3. Website Structure & Navigation'
    if title.lower().startswith('services'):
        title = '4. Services Offered'
    if title.lower().startswith('customer experience'):
        title = '5. Customer Experience & Sales Process'
    if title.lower().startswith('contact'):
        title = '6. Contact Information & Communication Rules'
    if title.lower().startswith('about the founder'):
        title = '7. Founder Profile & Professional Credentials'
    if title.lower().startswith('projects'):
        title = '8. Projects & Portfolio Knowledge'
    if title.lower().startswith('blog'):
        title = '9. Blog & Educational Content'
    if title.lower().startswith('customer satisfaction'):
        title = '10. Customer Satisfaction Guidelines'
    if title.lower().startswith('security and privacy'):
        title = '11. Security & Privacy Rules'
    if title.lower().startswith('phishing'):
        title = '12. Fraud Prevention'
    if title.lower().startswith('admin area'):
        title = '13. Admin Area & Restricted Systems'
    if title.lower().startswith('common customer questions'):
        title = '14. Common Customer Questions'
    if title.lower().startswith('response templates'):
        title = '15. Response Templates'
    if title.lower().startswith('escalation'):
        title = '16. Escalation & Human Handoff Rules'
    if title.lower().startswith('security dos'):
        title = '17. Security Do’s & Don’ts'
    if title.lower().startswith('final sop'):
        title = '18. Final SOP for Chatbot Operations'

    story.append(Paragraph(f'<font name="Helvetica-Bold" size="12" color="#0f172a">{title}</font>', section_title))

    lines = []
    for raw_line in body_text.split('\n'):
        cleaned = raw_line.strip()
        if not cleaned:
            continue
        if cleaned.startswith('- '):
            lines.append('• ' + cleaned[2:].strip())
        elif cleaned.startswith('Q:') or cleaned.startswith('A:') or cleaned.startswith('Template') or cleaned.startswith('Do:') or cleaned.startswith("Don't:") or cleaned.startswith('The chatbot should'):
            lines.append(cleaned)
        else:
            lines.append(cleaned)

    if lines:
        for line in lines:
            updated = re.sub(r'\s+', ' ', line)
            story.append(Paragraph(updated, body))

    story.append(Spacer(1, 4 * mm))

# Final summary page
story.append(PageBreak())
story.append(Paragraph('<font name="Helvetica-Bold" size="18" color="#0f172a">Quick Reference</font>', section_title))
story.append(Paragraph('<font name="Helvetica-Bold" color="#f97316">Official channels:</font> Email: dagia2061@gmail.com • Phone: +251-996-881-232 • Contact form: website public inquiry form', body))
story.append(Paragraph('<font name="Helvetica-Bold" color="#f97316">Brand:</font> SA teach startup is a design-first digital product and software services brand for modern web experiences.', body))
story.append(Paragraph('<font name="Helvetica-Bold" color="#f97316">Core rule:</font> Use only verified public facts and redirect customers to official business channels when required.', body))
story.append(Paragraph('<font name="Helvetica-Bold" color="#f97316">Security rule:</font> Never request passwords, verification codes, private admin details, or unofficial payment links.', body))
story.append(Paragraph('<font name="Helvetica-Bold" color="#f97316">Sales flow:</font> Home → About/Projects → Contact → Inquiry → Response via email or official contact process.', body))

# Render
pdf = SimpleDocTemplate(
    str(out),
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=14 * mm,
    bottomMargin=14 * mm,
    title='SA Teach Startup Chatbot Knowledge Base',
    author='Dagmawi Alemayhu',
    subject='Customer support and website assistant knowledge base',
    keywords='chatbot, support, portfolio, website, SA Teach Startup',
)

pdf.build(story)
print(f'Created PDF: {out}')
print('PDF generation complete.')
