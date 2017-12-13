var quill = null;

/* React Functions */
class QuilForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            height: '300px'
        };
    }
    componentDidMount(){
        //when QuilEditor is rendered to DOM for first time (init)
        hljs.configure({   // optionally configure hljs
            languages: ['javascript', 'ruby', 'python', 'html']
        });
        quill = new Quill('#editor', {
            scrollingContainer: '#scrolling-container', 
            theme: 'snow',
            modules: {
                syntax: true,
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    ['link', 'image', 'code-block']
                  ]
            }
        });
    }

    componentWillUnmount(){
        //when DOM produced by QuilEditor is removed
    }

    onSave(){
        //console.log(this.props.data.id);
        if (this.props.data.id === ''){
            //console.log(this.props);
            this.props.addItem(this.props.type);
        }
        else {
            this.props.saveItem(this.props.type, this.props.data.id);
        }
        
    }

    onDelete(){
        //console.log(this.props.data.id);
        if (this.props.data.id === ''){
        }
        else {
            this.props.deleteItem(this.props.type, this.props.data.id);
        }
    }

    onNew(){
        this.props.newItem();
    }
    
    convertUTC(date, timezone){
        if (date != '' && date != undefined){
            var utcDate = moment.utc(date, 'YYYY-MM-DD HH:mm:ss');
            var localDate = moment.tz(utcDate, timezone);
            return localDate.format("dddd, MMMM Do YYYY, h:mm:ss a");
        }
        return '';
    }

    render() {
        console.log("Rendering QuilEditor");
        console.log(this.props.data);
        
        var createdate_est = this.convertUTC(this.props.data.createdate, "America/New_York");
        var lastdate_est = this.convertUTC(this.props.data.lastdate, "America/New_York");
        return (
            <div id="quil-wrapper">
                <div id="quil-header-wrapper">
                    <input id="input-name" name="name" type="text" placeholder="Enter Title" className="form-input" />
                    <div id='date-wrapper'>
                        <span id='create-date'>{createdate_est}</span>
                        <span id='last-date'>{lastdate_est}</span>
                    </div>
                </div>
                <div id="scrolling-container">
                    <div id="quil-wrapper">
                        <div id="editor" className="quil_content">
                        <p>Enter Content</p>
                        </div>
                    </div>
                </div>
                <div id="button-wrapper">
                    <button id="button-submit" type="button" className="btn btn-success form-buttons" value="Save" onClick={this.onSave.bind(this)}>Save</button>
                    <button id="button-delete" type="button" className="btn btn-danger form-buttons" value="Delete" onClick={this.onDelete.bind(this)}>Delete</button>
                    <button id="button-new" type="button" className="btn btn-default form-buttons" value="New" onClick={this.onNew.bind(this)}>New</button>
                </div>
            </div>
        );
    }
}

class ListItems extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }

    loadItem_2(id){
        this.props.loadItem_2(id);
    }

    render() {
        console.log("Rendering ListItems");
        console.log(this.props);
        var entries = [];
        for (var i=0; i<this.props.data.length; i++){
            entries.push(
                <ListItem key={this.props.data[i].id} id={this.props.data[i].id} name={this.props.data[i].name} loadItem_3={this.loadItem_2.bind(this)}/>
            );
        }
        return (
            <div id="entries-wrapper">
                <h2>
                    Entries
                </h2>
                <ul>
                    {entries}
                </ul>
            </div>
        );
    }
}

class ListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: props.data
        };
    }

    loadItem_3(){
        this.props.loadItem_3(this.props.id);
    }

    render() {
        return (
            <li key={this.props.id}><a href='#' onClick={this.loadItem_3.bind(this)}>{this.props.name}</a></li>
        );
    }

}


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentId:0,
            listData:[],
            type: 'work',
            quilData:{
                'id':'',
                'name':'',
                'content':'',
                'createdate':'',
                'lastdate:':''
            }
        };
    }
    componentDidMount(){
        //when Object is rendered to DOM for first time (init)
        this.getData(this.state.type);
    }

    componentDidUpdate(){
        console.log("App componentDidUpdate");
        var name = this.state.quilData.name;
        document.getElementById('input-name').value = name;
        if (this.state.quilData.content != ''){
            console.log(name);
            var delta = JSON.parse(this.state.quilData.content);
            quill.setContents(delta);
        }
        else {
            var delta = {
                    "ops":[{"insert":"Enter Content"}]
                };
            quill.setContents(delta);
        }
    }

    componentWillUnmount(){
        //when DOM produced by Work is removed
    }

    getData(type){
        var component = this;
        console.log('$.get(/'+type+'/getall)');
        $.get('/'+type+'/getall', function(jsondata){
            component.setState({'listData':JSON.parse(jsondata)});
        });
    }

    setTypeWork(){
        console.log(this);
        var component = this;
        var type = 'work';
        component.setState({'type':type});
        this.getData(type);
        this.setQuilData('','','', '', '');
    }

    setTypeNotes(){
        console.log(this);
        var component = this;
        var type = 'notes';
        component.setState({'type':type});
        this.getData(type);
        this.setQuilData('','','', '', '');
    }

    setTypeDo(){
        console.log(this);
        var component = this;
        var type = 'do';
        component.setState({'type':type});
        this.getData(type);
        this.setQuilData('','','', '', '');
    }

    setQuilData(id, name, content, createdate, lastdate){
        console.log('setQuilData');
        var component = this;
        console.log(component);
        component.setState({'quilData':{
            'id':id,
            'name': name,
            'content': content,
            'createdate': createdate,
            'lastdate': lastdate
        }});
    }

    loadItem_1(id){
        var component = this;
        var type = component.state.type;
        console.log('$.get(/'+type+'/get)');
        $.get('/'+type+'/get/'+id, function(data){
            var myjson = JSON.parse(data)[0];
            component.setState({'quilData':{
                'id':id,
                'name': myjson['name'],
                'content': myjson['content_blob'],
                'createdate': myjson['createdate'],
                'lastdate': myjson['lastdate']
            }});
        });
    }

    addItem(type){
        console.log('add');
        var component = this;
        var name = document.getElementById('input-name').value;
        var content = JSON.stringify(quill.getContents()); 
        console.log('Name:'+name);
        console.log('Content:'+content);
        if (name === ''){
            alert('Title is empty');
            return;
        }
        console.log('adding to '+type);
        $.post('/'+type+'/add', {'name':name, 'content':content})
            .done(function(data){
                console.log('done');
                console.log(data);
                var myjson = JSON.parse(data)[0];
                component.setQuilData(myjson['id'], myjson['name'], myjson['content_blob'], myjson['createdate'], myjson['lastdate']);
                component.getData(type);
            });
    }

    saveItem(type, id){
        console.log('save');
        var component = this;
        var name = document.getElementById('input-name').value;
        var content = JSON.stringify(quill.getContents()); 
        console.log('Name:'+name);
        console.log('Content:'+content);
        //component.setQuilData(id, name, content);
        if (name === ''){
            alert('Title is empty');
            return;
        }
        $.post('/'+type+'/update/'+id, {'name':name, 'content':content})
            .done(function(data){
                console.log('done');
                console.log(data);
                var myjson = JSON.parse(data)[0];
                component.setQuilData(myjson['id'], myjson['name'], myjson['content_blob'], myjson['createdate'], myjson['lastdate']);
            }
        );
    }

    deleteItem(type, id){
        console.log('delete');
        var component = this;
        component.setQuilData('', '', '', '', '');
        $.get('/'+type+'/delete/'+id)
        .done(function(data){
            console.log('done');
            component.getData(type);
        }
        );
    }

    newItem(){
        console.log('new');
        var component = this;
        component.setQuilData('', '', '', '', '');
    }

    render() {
        console.log('Quill Data:'+this.state.quilData);
        console.log('List:'+this.state.listData);
        return (
            <div>
                <div className='body-container'>
                <div className='body'>
                    <div className='body-top'>
                        <h3></h3>
                    </div>
                    <div className='body-left'>
                        <ul className='body-left-menu'>
                            <li><a href='#' className='body-left-menu-item' onClick={this.setTypeWork.bind(this)}>work</a></li>
                            <li><a href='#' className='body-left-menu-item' onClick={this.setTypeNotes.bind(this)}>notes</a></li>
                            <li><a href='#' className='body-left-menu-item' onClick={this.setTypeDo.bind(this)}>do</a></li>
                        </ul>
                    </div>
                    <div className='body-mid'>
                        <div className='body-left-header'>
                                <h3>{this.state.type}</h3>
                        </div>
                        <div id='body-entry'>
                            <QuilForm data={this.state.quilData}  addItem={this.addItem} 
                            saveItem={this.saveItem} deleteItem={this.deleteItem} newItem={this.newItem}
                            setQuilData={this.setQuilData.bind(this)}
                            type={this.state.type} getData={this.getData.bind(this)} />
                            <ListItems data={this.state.listData} loadItem_2={this.loadItem_1.bind(this)} />
                        </div>
                    </div>
                    <div className='body-right'>
                    </div>
                </div>
                </div>
            </div>
        );
    }

}

var View = function(){
    return (
        <App data={[]}/>
    );
}

console.log("Running ReactDOM.render()");
ReactDOM.render(
    View(),
    document.getElementById('root')
);