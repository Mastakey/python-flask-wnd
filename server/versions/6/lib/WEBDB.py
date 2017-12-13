import pyodbc
import sqlite3

class WEBDB(object):
    def __init__(self, dbStr, config):
        #DRIVER={SQL Server};SERVER=SQLBRSDEV02;DATABASE=Serena;UID=SerenaAdm;PWD=$3r3n4Adm1
        if config['type'] == 'sqlite':
            self.dbcon = sqlite3.connect(dbStr)
        else:
            self.dbcon = pyodbc.connect(dbStr)
        self.cursor = self.dbcon.cursor()
        self.config = config

    def debugLog(self, string):
        if self.config['logging'] == "on":
            f = open("WEBDB.log", "a")
            f.write(string)
            f.write("\n")

    def executeQuery(self, query):
        cursor = self.dbcon.cursor()
        self.debugLog(query)
        values = cursor.execute(query)
        self.dbcon.commit()
        return values

    def executeQueryDict(self, query):
        cursor = self.dbcon.cursor()
        self.debugLog(query)
        results = cursor.execute(query)
        column_dict = {}
        result_list = []
        count = 0
        for columns in cursor.description:
            column_dict[columns[0]] = count
            count += 1
        for result in results:
            result_dict = {}
            for key in column_dict.keys():
                    result_dict[key] = result[column_dict[key]]
            result_list.append(result_dict)
        return result_list
