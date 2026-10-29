from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

root = Path(__file__).resolve().parents[1]
out = root / 'public/Sai-Madhav-Resume.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='NameCustom', fontName='Helvetica-Bold', fontSize=26, leading=30, textColor=colors.HexColor('#142536'), spaceAfter=6))
styles.add(ParagraphStyle(name='RoleCustom', fontSize=11, leading=15, textColor=colors.HexColor('#465663'), spaceAfter=9))
styles.add(ParagraphStyle(name='SectionCustom', fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=colors.HexColor('#17646a'), spaceBefore=18, spaceAfter=7))
styles.add(ParagraphStyle(name='BodyCustom', fontSize=10, leading=15, spaceAfter=6))
styles.add(ParagraphStyle(name='ProjectCustom', fontName='Helvetica-Bold', fontSize=11, leading=16, spaceBefore=6, spaceAfter=4))
styles.add(ParagraphStyle(name='LinkCustom', fontSize=9, leading=13, textColor=colors.HexColor('#465663'), spaceAfter=6))
story=[]
def p(text, style='BodyCustom'):
    story.append(Paragraph(text, styles[style]))

p('SAI MADHAV', 'NameCustom')
p('Computer Science Undergraduate | Data Science Specialization', 'RoleCustom')
p('<link href="https://www.linkedin.com/in/saimadhav1">LinkedIn: saimadhav1</link> &nbsp; | &nbsp; <link href="https://github.com/saimadhav10">GitHub: saimadhav10</link>', 'LinkCustom')
story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#b8c9cc')))
p('PROFILE', 'SectionCustom')
p('B.Tech Computer Science student specializing in Data Science, fascinated by data and numbers. Interested in exploratory data analysis, practical software development, and project planning, with projects spanning a real-time multiplayer web game and a Flutter mobile application.')
p('EDUCATION', 'SectionCustom')
p('<b>Mar Athanasius College of Engineering, Kothamangalam</b>')
p('B.Tech in Computer Science with specialization in Data Science<br/>Expected graduation: 2029')
p('SKILLS', 'SectionCustom')
p('<b>Programming:</b> Python, Java, C, HTML, CSS<br/><b>Data:</b> Exploratory data analysis (EDA), data analysis, pandas, scikit-learn<br/><b>Application development:</b> Flutter<br/><b>Foundations:</b> Network theory, basic hardware<br/><b>Planning:</b> Project planning')
p('SELECTED PROJECTS', 'SectionCustom')
p('Pookalam.io | Real-time Multiplayer Web Game', 'ProjectCustom')
p('An Onam-inspired drawing game with private multiplayer rooms, timed floral-pattern challenges, anonymous peer judging, and leaderboards. Uses an HTML5 Canvas drawing interface and Socket.io for real-time room and game-state updates.')
p('<b>Project stack:</b> React, Vite, Tailwind CSS, Node.js, Express, Socket.io')
p('<link href="https://github.com/saimadhav10/pookalam-io">github.com/saimadhav10/pookalam-io</link>', 'LinkCustom')
p('COCTracker | Offline-first Android Companion', 'ProjectCustom')
p('A Flutter companion for Clash of Clans that imports game JSON exports, manages multiple local village profiles, and tracks upgrades with persistent countdowns. Includes progress dashboards, upgrade recommendations, and backup and restore functionality.')
p('<b>Project stack:</b> Flutter, Dart, local storage')
p('<link href="https://github.com/saimadhav10/COCTracker">github.com/saimadhav10/COCTracker</link>', 'LinkCustom')
SimpleDocTemplate(str(out), pagesize=A4, rightMargin=45, leftMargin=45, topMargin=40, bottomMargin=40, title='Sai Madhav - Resume', author='Sai Madhav').build(story)
print(out)
