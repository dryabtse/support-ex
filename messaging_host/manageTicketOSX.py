#!/usr/local/bin/python3
# OSX-specific

from applescript import tell

def runBash(command, andClose=False):
  tell.app( 'Terminal', 'do script "' + command + '"')
  tell.app( 'Terminal', 'activate' )
  if andClose == True:
    tell.app('Terminal', 'close front window')

def manageTicket(sourceMessageText):
  sourceMessage = eval(sourceMessageText)
  if "ticketNum" in sourceMessage:
    # logger('\nTicket: %s' % sourceMessage['ticketNum'])
    if sourceMessage['ticketNum'] != 'null':
      runBash('newTicketDir %s ' % sourceMessage['ticketNum'])
  elif "clearSides" in sourceMessage:
    # logger('\nClearSides: %s' % sourceMessage['clearSides'])
    if sourceMessage['clearSides'] == 1:
      runBash('clearSides', True)

