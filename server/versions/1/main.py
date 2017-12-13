from flask import Flask, render_template
from lib.WEBDB import WEBDB
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
    myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})
    myQuery = """
    SELECT *
    FROM test
    """
    results = myDB.executeQueryDict(myQuery)
    return render_template('main.tmpl', title='My Title', main='My Main', results=results)

@app.route('/work/add', methods=['POST'])
@crossdomain(origin='*')
def work_add():
    myDB = WEBDB(dbfile, {'logging':'on', 'type':'sqlite'})

if __name__ == '__main__':
    app.run()
