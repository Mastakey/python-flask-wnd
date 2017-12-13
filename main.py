from flask import Flask, render_template, request, make_response, current_app
from datetime import timedelta
from functools import update_wrapper
from lib.APP import APP
from lib.WEBDB import WEBDB
import json
app = Flask('work-notes-do')
app.debug = True

#CONFIGs
dbfile = 'db/work-notes-do.db'

def getApp():
    #gets the APP object
    myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})
    myApp = APP(myDB, [])
    return myApp

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
    return render_template('main.html', title='work-notes-do', main='work-notes-do')

@app.route('/<mytype>/getall', methods=['GET'])
@crossdomain(origin='*')
def work_get_all(mytype):
    myApp = getApp()
    results = myApp.getAll(mytype)
    return json.dumps(results)

@app.route('/<mytype>/get/<id>', methods=['GET'])
@crossdomain(origin='*')
def work_get(mytype, id):
    myApp = getApp()
    results = myApp.get(mytype, id)
    return json.dumps(results)

@app.route('/<mytype>/add', methods=['POST'])
@crossdomain(origin='*')
def work_add(mytype):
    myApp = getApp()
    #args/input
    args = request.form
    name = args['name']
    content = args['content']
    id = myApp.add(mytype, name, content)
    results = myApp.get(mytype, id)
    return json.dumps(results)

@app.route('/<mytype>/delete/<id>', methods=['GET'])
@crossdomain(origin='*')
def work_delete(mytype, id):
    myApp = getApp()
    myApp.delete(mytype, id)
    return json.dumps([])

@app.route('/<mytype>/update/<id>', methods=['POST'])
@crossdomain(origin='*')
def work_update(mytype, id):
    myApp = getApp()
    args = request.form
    name = args['name']
    content = args['content']
    myApp.update(mytype, id, name, content)
    results = myApp.get(mytype, id)
    return json.dumps(results)
    
if __name__ == '__main__':
    app.run(port=5001)
