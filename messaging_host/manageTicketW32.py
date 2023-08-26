#!/usr/local/bin/python3
# Win32-specific

import os

ENABLE_LOGGING = True
PATHPREFIX = ''
LOGFILE = PATHPREFIX + 'log.txt'
TMPSCRIPT = PATHPREFIX + 'runme.sh'

def logger(text):
  if ENABLE_LOGGING == True:
    f = open(LOGFILE, 'a')
    f.write(text)
    f.close()

def manageTicket(sourceMessageText):
  sourceMessage = eval(sourceMessageText)
  if "ticketNum" in sourceMessage:
    logger('\nTicket: %s' % sourceMessage['ticketNum'])
    if sourceMessage['ticketNum'] != 'null':
      f = open(TMPSCRIPT, 'w')
      f.write('. ~/manageTicket.sh %s && bash' % sourceMessage['ticketNum'])
      runBash()
      pinTicketDir(sourceMessage['ticketNum'])
  elif "clearSides" in sourceMessage:
    if sourceMessage['clearSides'] == 1:
      clearSides()
      

def runBash():
  bashExecPath = 'C:\\Windows\\System32\\bash.exe'
  os.system("start cmd /c " + bashExecPath + ' runme.sh')


def pinTicketDir(ticket):
  os.system("start cmd /c powershell -file \"H:\\WORK\\Tools\\add-quick-access-link.ps1\" \"H:\\WORK\\OPEN\\" + ticket)

def clearSides():
  os.system("start cmd /c powershell -file \"H:\\WORK\\Tools\\clear-sides.ps1\" \"H:\WORK\OPEN\"")


