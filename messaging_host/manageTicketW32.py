#!/usr/local/bin/python3
# Win32-specific

import os

def manageTicket(sourceMessageText):
  sourceMessage = eval(sourceMessageText)
  if "ticketNum" in sourceMessage:
    logger('\nTicket: %s' % sourceMessage['ticketNum'])
    if sourceMessage['ticketNum'] != 'null':
      f = open(TMPSCRIPT, 'w')
      f.write('. ~/manageTicket.sh %s && bash' % sourceMessage['ticketNum'])
      runBash()
      pinTicketDir(sourceMessage['ticketNum'])
      

def runBash():
  bashExecPath = 'C:\\Windows\\System32\\bash.exe'
  os.system("start cmd /c " + bashExecPath + ' runme.sh')


def pinTicketDir(ticket):
  os.system("start cmd /c powershell -file \"H:\\WORK\\Tools\\add-quick-access-link.ps1\" \"H:\\WORK\\OPEN\\" + ticket)

