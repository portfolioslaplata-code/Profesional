"""Genera únicamente los assets de muestra. Requiere reportlab, Pillow y pypdfium2."""
import json
import sys
from pathlib import Path
from html import escape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image, ImageDraw, ImageFont
import pypdfium2 as pdfium

data = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
font_regular = Path('C:/Windows/Fonts/arial.ttf')
font_bold = Path('C:/Windows/Fonts/arialbd.ttf')
if not font_regular.exists():
    font_regular = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
    font_bold = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
pdfmetrics.registerFont(TTFont('Body', str(font_regular)))
pdfmetrics.registerFont(TTFont('Bold', str(font_bold)))
palette = data['theme']['colors']
ink = colors.HexColor(palette['text'])
muted = colors.HexColor(palette['muted'])
primary = colors.HexColor(palette['primary'])
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Name', fontName='Bold', fontSize=29, leading=34, textColor=ink, spaceAfter=7))
styles.add(ParagraphStyle(name='Role', fontName='Body', fontSize=12, leading=16, textColor=primary, spaceAfter=10))
styles.add(ParagraphStyle(name='Copy', fontName='Body', fontSize=9, leading=13, textColor=muted, spaceAfter=7))
styles.add(ParagraphStyle(name='Item', fontName='Bold', fontSize=10, leading=14, textColor=ink, spaceAfter=3))
styles.add(ParagraphStyle(name='Section', fontName='Bold', fontSize=10, leading=14, textColor=primary, spaceBefore=14, spaceAfter=8))
styles.add(ParagraphStyle(name='Small', fontName='Body', fontSize=7.5, leading=11, textColor=muted, spaceAfter=7))

def text(value):
    return escape(str(value)).replace('—', '-').replace('−', '-').replace('–', '-')

def para(value, style='Copy'):
    return Paragraph(text(value), styles[style])

full_name = f"{data['firstName']} {data['lastName']}"
story = [para('DEMO / PERFIL Y RESULTADOS FICTICIOS', 'Small'), para(full_name, 'Name'), para(data['profession'], 'Role'), para(f"{data['location']} | {data['email']}", 'Small'), para(data['hero']['description'])]
metrics = [[para(f"{item['value']} {item['label']}", 'Small') for item in data['highlights'][:3]]]
table = Table(metrics, colWidths=[166, 166, 166])
table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor(palette['surface'])), ('TOPPADDING', (0, 0), (-1, -1), 10), ('BOTTOMPADDING', (0, 0), (-1, -1), 4)]))
story += [Spacer(1, 5), table, para('EXPERIENCIA', 'Section')]
for item in data['experience']:
    story += [para(item['title'], 'Item'), para(f"{item['institution']} | {item['period']} | {item.get('location', '')}", 'Small'), para(item['description'])]
story += [para('PROYECTOS SELECCIONADOS', 'Section')]
for item in data['projects']['items']:
    result = ' · '.join(f"{m['value']} {m['label']}" for m in item.get('metrics', []))
    story += [para(f"{item['name']} ({item['year']})", 'Item'), para(f"{item['category']}. {result}", 'Small')]
story += [para('FORMACIÓN', 'Section')]
for item in data['education']:
    story += [para(item['title'], 'Item'), para(f"{item['institution']} | {item['period']} | {item.get('status', '')}", 'Small')]
story += [para('COMPETENCIAS', 'Section')]
for group in data['skills']['groups'][:2]:
    story += [para(f"{group['name']}: {', '.join(group['items'])}", 'Small')]
for fact in data['about'].get('facts', []):
    if fact['label'] == 'Idiomas':
        story += [para(f"{fact['label']}: {fact['value']}", 'Small')]

def footer(canvas, doc):
    canvas.setStrokeColor(colors.HexColor(palette['border']))
    canvas.line(48, 40, 547, 40)
    canvas.setFont('Body', 6.5)
    canvas.setFillColor(muted)
    canvas.drawString(48, 27, 'Contenido ficticio de demostración. No corresponde a una persona real. Contacto no operativo.')
    canvas.drawRightString(547, 27, str(doc.page))

doc = SimpleDocTemplate('public/cv-demo.pdf', pagesize=(595.28, 841.89), rightMargin=48, leftMargin=48, topMargin=36, bottomMargin=55, title=f'{full_name} - CV de demostración', author='Portfolios La Plata')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
pdf = pdfium.PdfDocument('public/cv-demo.pdf')
if len(pdf) != 1:
    raise ValueError(f'El CV demo debe tener una página, tiene {len(pdf)}')
pdf[0].render(scale=1.5).to_pil().save('tmp/pdfs/cv-preview.png')
print(f'CV creado y renderizado: {len(pdf)} página; {len(pdf[0].get_textpage().get_text_range())} caracteres.')

image = Image.new('RGB', (1200, 630), palette['background'])
draw = ImageDraw.Draw(image)
def font(size, bold=False):
    return ImageFont.truetype(str(font_bold if bold else font_regular), size)
draw.rectangle((825, 0, 1200, 630), fill=palette['accent'])
for y in range(60, 610, 48):
    draw.line((850, y, 1190, y), fill=palette['border'])
for x in range(850, 1200, 48):
    draw.line((x, 40, x, 590), fill=palette['border'])
draw.text((70, 60), 'PORTFOLIO PROFESIONAL / DEMO', font=font(18), fill=palette['muted'])
draw.text((70, 164), full_name, font=font(75, True), fill=palette['text'])
draw.text((74, 264), data['profession'], font=font(28), fill=palette['primary'])
draw.text((70, 350), data['hero']['title'], font=font(42), fill=palette['text'])
draw.text((70, 408), data['hero']['emphasis'], font=font(42), fill=palette['primary'])
draw.line((70, 536, 760, 536), fill=palette['border'], width=2)
draw.text((70, 560), 'Perfil ficticio · Portfolios La Plata', font=font(18), fill=palette['muted'])
draw.ellipse((886, 236, 1126, 476), fill=palette['secondary'])
draw.text((935, 296), data['monogram'], font=font(90), fill=palette['accent'])
image.save('public/images/og-cover.png', optimize=True)
print('Open Graph local creado: 1200 × 630.')
