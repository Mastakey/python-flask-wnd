def getTable(mytype):
    return 'table_'+mytype


class APP(object):
    def __init__(self, myDB, config):
        self.myDB = myDB
        self.config = config

    def getAll(self, mytype):
        table = ''
        table = getTable(mytype)
        query = """
        SELECT id, name, content_id, createdate, lastdate, active
        FROM
        """+table+"""
        WHERE
        active = 1
        """
        return self.myDB.executeQueryDict(query)

    def get(self, mytype, id):
        table = ''
        table = getTable(mytype)
        query = """
        SELECT w.id, w.name, w.content_id, w.createdate, w.lastdate, w.active, c.content_blob
        FROM
        """+table+""" w,
        table_content c
        WHERE
        w.content_id = c.id AND
        w.id = """+str(id)+"""
        """
        return self.myDB.executeQueryDict(query)

    def add(self, mytype, name, content):
        table = ''
        table = getTable(mytype)
        
        #add to table_content
        content_id = self.myDB.insertQueryBlob('INSERT INTO table_content (content_blob) VALUES (?)', content)
        print (content_id)

        #add to table_work
        sql_work_insert = """
        INSERT INTO """+table+""" (name, content_id, createdate, lastdate, active) 
        VALUES (
        \'"""+name+"""\', 
        """+str(content_id)+""", 
        datetime(\'now\'), 
        datetime(\'now\'),
        1
        )
        """
        return self.myDB.insertQuery(sql_work_insert)

    def update(self, mytype, id, name, content):
        table = ''
        table = getTable(mytype)

        #update to table
        sql_work_update = """
        UPDATE """+table+"""
        SET name ='"""+name+"""',
        lastdate=datetime(\'now\')
        WHERE id = """+str(id)+"""
        """

        #get content id
        sql_get_content = """
        SELECT content_id from """+table+"""
        WHERE id="""+str(id)+"""
        """

        contentId = self.myDB.executeQueryDict(sql_get_content)[0]['content_id']

        #update content
        self.myDB.updateQueryBlob('UPDATE table_content SET content_blob=(?) WHERE id='+str(contentId), content)

        work_id = self.myDB.insertQuery(sql_work_update)

    def delete(self, mytype, id):
        table = ''
        table = getTable(mytype)

        query = """
        UPDATE """+table+"""
        SET active = 0
        WHERE
        id = """+str(id)+"""
        """
        self.myDB.updateQuery(query)

    def add_history(self, mytype, id, name, content):
        table = ''
        table = getTable(mytype)


        #table_name, ref_id, change_type, old_content_id, new_content_id, old_value, new_value

        


#tests
def test_getAll():
    dbfile = '../db/work-notes-do.db'
    myApp = APP(dbfile, [])
    results = myApp.getAll(dbfile)
    print (results)


def test_update():
    dbfile = '../db/work-notes-do.db'
    myApp = APP(dbfile, [])
    results = myApp.getAll(dbfile)
    print (results)


#test_getAll()
        