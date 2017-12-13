class APP(object):
    def __init__(self, myDB, config):
        self.myDB = myDB
        self.config = config

    def getAll(self, type):
        table = ''
        if (type == 'work'):
            table = 'table_work'
        elif (type == 'note'):
            table = 'table_notes'
        query = """
        SELECT id, name, content_id, createdate, lastdate, active
        FROM
        """+table+"""
        WHERE
        active = 1
        """
        return self.myDB.executeQueryDict(query)


#tests
def test_getAll():
    dbfile = '../db/work-notes-do.db'
    myApp = APP(dbfile, [])
    results = myApp.getAll(dbfile)
    print (results)


#test_getAll()
        