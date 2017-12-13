from WEBDB import WEBDB
from APP import APP

dbfile = '../db/work-notes-do.db'
myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})
myApp = APP(myDB, [])
myApp.update('notes', 1, 'test1', '')