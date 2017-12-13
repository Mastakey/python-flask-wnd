var myf = function(){
    console.log('test');
}

var addEntry = function(type, args){
    if (type === 'work'){
        addWork(args);
    }
}

var addWork = function(args){
    name = args['name'];
    content = args['content'];
    console.log(content);
}

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
            this.props.saveWorkItem();
        }
        
    }

    render() {
        console.log("Rendering QuilEditor");
        console.log(this.props.data);
        return (
            <div>
                <input id="input-name" name="name" type="text" placeholder="Enter Title" className="form-input" />
                <div id="editor" className="quil_content">
                <p>Enter Content</p>
                </div>
                <input id="button-submit" type="button" value="Save" onClick={this.onSave.bind(this)} />
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
            <ul>
                {entries}
            </ul>
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
            var delta = JSON.parse(this.state.quilData.content);
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
        console.log(this);
        var name = document.getElementById('input-name').value;
        var content = JSON.stringify(quill.getContents()); 
        console.log('Name:'+name);
        console.log('Content:'+content);
        $.post('/work/add', {'name':name, 'content':content})
            .done(function(data){
                console.log('done');
            }
        );
    }

    saveWorkItem(){
        console.log('save');
        console.log(this);
    }

    render() {
        console.log('Quill Data:'+this.state.quilData);
        console.log('Work List:'+this.state.workListData);
        return (
            <div>
                <QuilForm data={this.state.quilData}  addWorkItem={this.addWorkItem} saveWorkItem={this.saveWorkItem} />
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