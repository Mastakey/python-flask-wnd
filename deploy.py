import shutil, errno
import sys
import json

def copyanything(src, dst):
    try:
        shutil.copytree(src, dst)
    except OSError as exc: # python >2.5
        if exc.errno == errno.ENOTDIR:
            shutil.copy(src, dst)
        else: raise

dir = 'C:\\local\\flask\\work-notes-do'

def main():
    f = open('conf\\conf.json', 'r')
    conf = json.loads(f.read())
    version = conf['version']
    
    copyanything(dir+'\\db', dir+'\\server\\versions\\'+str(version)+'\\db')
    copyanything(dir+'\\lib', dir+'\\server\\versions\\'+str(version)+'\\lib')
    copyanything(dir+'\\static', dir+'\\server\\versions\\'+str(version)+'\\static')
    copyanything(dir+'\\templates', dir+'\\server\\versions\\'+str(version)+'\\templates')
    copyanything(dir+'\\main.py', dir+'\\server\\versions\\'+str(version)+'\\main.py')
    copyanything(dir+'\\run.bat', dir+'\\server\\versions\\'+str(version)+'\\run.bat')
    
    #Set Version
    nextVersion = int(version) + 1
    conf['version'] = nextVersion
    f = open('conf\\conf.json', 'w')
    f.write(json.dumps(conf))
    
main()