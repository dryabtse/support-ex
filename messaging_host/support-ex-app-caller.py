#!/usr/bin/python3

import struct
import sys
import threading
from datetime import datetime
try:
  import queue as Queue
except ImportError:
  import Queue

# On Windows, the default I/O mode is O_TEXT. Set this to O_BINARY
# to avoid unwanted modifications of the input/output streams.
PY3K = sys.version_info >= (3, 0)

if PY3K:
    sin = sys.stdin.buffer
    sout = sys.stdout.buffer

else:
    if sys.platform == "win32":
      import os, msvcrt
      msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
      msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    sin = sys.stdin
    sout = sys.stdout

PATHPREFIX = ''
if sys.platform == "darwin":
  # from applescript import tell
  PATHPREFIX = '/tmp/'
  from manageTicketOSX import manageTicket

if sys.platform == "win32":
  from manageTicketW32 import manageTicket

LOGFILE = PATHPREFIX + 'support_ex_log.txt'
TMPSCRIPT = PATHPREFIX + 'runme.sh'

ENABLE_LOGGING = True

def logger(text):
  if ENABLE_LOGGING == True:
    current_time = datetime.now().strftime("%Y/%m/%d:%H:%M:%S")
    text = current_time + "\t" + text.strip() + "\n"
    f = open(LOGFILE, 'a')
    f.write(text)
    f.close()

# Helper function that sends a message to the webapp.
def send_message(message):
  # Write message size.
  sout.write(struct.pack('I', len(message)))
  # Write the message itself.
  sout.write(str.encode(message))
  sout.flush()

# Thread that reads messages from the webapp.
def read_thread_func(queue):
  message_number = 0

  while 1:
    # Read the message length (first 4 bytes).
    text_length_bytes = sin.read(4)
    if len(text_length_bytes) == 0:
      if queue:
        queue.put(None)
      sys.exit(0)

    # Unpack message length as 4 byte integer.
    text_length = struct.unpack('i', text_length_bytes)[0]
    logger('\ntext_length == %s' % text_length)

    # Read the text (JSON object) of the message.
    text = sin.read(text_length).decode('utf-8')
    logger('\nMessage received - %s' % text)

    manageTicket(text)

    if queue:
      queue.put(text)
    else:
      # In headless mode just send an echo message back.
      send_message('{"echo": %s}' % text)

def Main():
  try:
    logger('\nApp starting')
    read_thread_func(None)

    queue = Queue.Queue()
    
    thread = threading.Thread(target=read_thread_func, args=(queue,))
    thread.daemon = True
    thread.start()

    sys.exit(0)
  except Exception as e:
    logger('\nAn exceptional thing happened - %s' % e)
    raise e

if __name__ == '__main__':
  Main()
