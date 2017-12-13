from flask import Flask, render_template, request, make_response, current_app
from datetime import timedelta
from functools import update_wrapper
from lib.WEBDB import WEBDB
import json
app = Flask('work-notes-do')
app.debug = True

#CONFIGs
dbfile = 'db/work-notes-do.db'

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()
    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

@app.route('/')
def run_main():
    return render_template('main.html', title='My Title', main='work-notes-do')

@app.route('/work/getall', methods=['GET'])
@crossdomain(origin='*')
def work_get_all():
    myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})
    query = """
    SELECT id, name, content_id, createdate, lastdate, active
    FROM
    table_work
    WHERE
    active = 1
    """
    results = myDB.executeQueryDict(query)
    return json.dumps(results)

@app.route('/work/get/<id>', methods=['GET'])
@crossdomain(origin='*')
def work_get(id):
    myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})
    workquery = """
    SELECT w.id, w.name, w.content_id, w.createdate, w.lastdate, w.active, c.content_blob
    FROM
    table_work w,
    table_content c
    WHERE
    w.content_id = c.id AND
    w.id = """+str(id)+"""
    """
    results = myDB.executeQueryDict(workquery)
    return json.dumps(results)

@app.route('/work/add', methods=['POST'])
@crossdomain(origin='*')
def work_add():
    #args/input
    args = request.form
    name = args['name']
    content = args['content']

    myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})
    
    #add to table_content
    content_id = myDB.insertQueryBlob('INSERT INTO table_content (content_blob) VALUES (?)', content)
    print (content_id)

    #add to table_work
    sql_work_insert = """
    INSERT INTO table_work (name, content_id, createdate, lastdate, active) 
    VALUES (
    \'"""+name+"""\', 
    """+str(content_id)+""", 
    datetime(\'now\'), 
    datetime(\'now\'),
    1
    )
    """
    work_id = myDB.insertQuery(sql_work_insert)
    return json.dumps([])

@app.route('/work/delete/<id>', methods=['GET'])
@crossdomain(origin='*')
def work_delete(id):
    myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})
    query = """
    UPDATE table_work
    SET active = 0
    WHERE
    id = """+str(id)+"""
    """
    myDB.updateQuery(query)
    return json.dumps([])

@app.route('/work/update/<id>', methods=['POST'])
@crossdomain(origin='*')
def work_update(id):
    args = request.form
    name = args['name']
    content = args['content']

    myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})

    #update to table_content
    myDB.updateQueryBlob('UPDATE table_content SET content_blob=(?) WHERE id='+str(id), content)

    #update to table_work
    sql_work_update = """
    UPDATE table_work
    SET name ='"""+name+"""',
    lastdate=datetime(\'now\')
    WHERE id = """+str(id)+"""
    """
    work_id = myDB.insertQuery(sql_work_update)
    return json.dumps([])
    
if __name__ == '__main__':
    app.run()
