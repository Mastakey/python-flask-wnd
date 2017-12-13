var quill = null;

/* React Functions */
class QuilForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }
    componentDidMount(){
        //when QuilEditor is rendered to DOM for first time (init)
        quill = new Quill('#editor', {
            theme: 'snow'
        });
    }

    componentWillUnmount(){
        //when DOM produced by QuilEditor is removed
    }

    onSave(){
        //console.log(this.props.data.id);
        if (this.props.data.id === ''){
            this.props.addWorkItem();
        }
        else {
            this.props.saveWorkItem(this.props.data.id);
        }
        
    }

    onDelete(){
        //console.log(this.props.data.id);
        if (this.props.data.id === ''){
        }
        else {
            this.props.deleteWorkItem(this.props.data.id);
        }
    }

    render() {
        console.log("Rendering QuilEditor");
        console.log(this.props.data);
        return (
            <div>
                <input id="input-name" name="name" type="text" placeholder="Enter Title" className="form-input" />
                <div id="quil-wrapper">
                    <div id="editor" className="quil_content">
                    <p>Enter Content</p>
                    </div>
                </div>
                <button id="button-submit" type="button" className="btn btn-success form-buttons" value="Save" onClick={this.onSave.bind(this)}>Save</button>
                <button id="button-delete" type="button" className="btn btn-danger form-buttons" value="Delete" onClick={this.onDelete.bind(this)}>Delete</button>
            </div>
        );
    }
}

class WorkListItems extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }

    loadWorkItem_2(id){
        this.props.loadWorkItem_2(id);
    }

    render() {
        console.log("Rendering WorkListItems");
        console.log(this.props);
        var entries = [];
        for (var i=0; i<this.props.data.length; i++){
            entries.push(
                <WorkListItem key={this.props.data[i].id} id={this.props.data[i].id} name={this.props.data[i].name} loadWorkItem_3={this.loadWorkItem_2.bind(this)}/>
            );
        }
        return (
            <div>
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

class WorkListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: props.data
        };
    }

    loadWorkItem_3(){
        this.props.loadWorkItem_3(this.props.id);
    }

    render() {
        return (
            <li key={this.props.id}><a href='#' onClick={this.loadWorkItem_3.bind(this)}>{this.props.name}</a></li>
        );
    }

}


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentId:0,
            workListData:[],
            quilData:{
                'id':'',
                'name':'',
                'content':''
            }
        };
    }
    componentDidMount(){
        //when Work is rendered to DOM for first time (init)
        this.getWorkData();
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

    getWorkData(){
        var component = this;
        console.log('$.get(/work/getall)');
        $.get('/work/getall', function(jsondata){
            component.setState({'workListData':JSON.parse(jsondata)});
        });
    }

    setQuilData(id, name, content){
        console.log('setQuilData');
        var component = this;
        console.log(component);
        component.setState({'quilData':{
            'id':id,
            'name': name,
            'content': content
        }});
    }

    loadWorkItem_1(id){
        var component = this;
        console.log('$.get(/work/get)');
        $.get('/work/get/'+id, function(data){
            var myjson = JSON.parse(data)[0];
            component.setState({'quilData':{
                'id':id,
                'name': myjson['name'],
                'content': myjson['content_blob']
            }});
        });
    }

    addWorkItem(){
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
        $.post('/work/add', {'name':name, 'content':content})
            .done(function(data){
                console.log('done');
                component.getWorkData();
            });
    }

    saveWorkItem(id){
        console.log('save');
        var component = this;
        var name = document.getElementById('input-name').value;
        var content = JSON.stringify(quill.getContents()); 
        console.log('Name:'+name);
        console.log('Content:'+content);
        component.setQuilData(id, name, content);
        if (name === ''){
            alert('Title is empty');
            return;
        }
        $.post('/work/update/'+id, {'name':name, 'content':content})
            .done(function(data){
                console.log('done');
                component.getWorkData();
            }
        );
    }

    deleteWorkItem(id){
        console.log('delete');
        var component = this;
        component.setQuilData('', '', '');
        $.get('/work/delete/'+id)
        .done(function(data){
            console.log('done');
            component.getWorkData();
        }
        );
    }

    render() {
        console.log('Quill Data:'+this.state.quilData);
        console.log('Work List:'+this.state.workListData);
        return (
            <div>
                <QuilForm data={this.state.quilData}  addWorkItem={this.addWorkItem} 
                saveWorkItem={this.saveWorkItem} deleteWorkItem={this.deleteWorkItem} 
                getWorkData={this.getWorkData.bind(this)} setQuilData={this.setQuilData.bind(this)}/>
                <WorkListItems data={this.state.workListData} loadWorkItem_2={this.loadWorkItem_1.bind(this)} />
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