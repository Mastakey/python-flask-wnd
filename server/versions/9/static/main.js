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

/* React Functions */
class QuilForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            content: ''
        };
    }
    componentDidMount(){
        //when QuilEditor is rendered to DOM for first time (init)
        var quill = new Quill('#editor', {
            theme: 'snow'
        });
    }

    componentWillUnmount(){
        //when DOM produced by QuilEditor is removed
    }

    onSubmit(){
        var name = document.getElementById('input-name').value;
        var content = '';
        this.props.addWorkItem(name, content);
    }

    render() {
        console.log("Rendering QuilEditor");
        console.log(this.state);
        return (
            <div>
                <input id="input-name" name="name" type="text" placeholder="Enter Title" className="form-input"/>
                <div id="editor" className="quil_content">
                <p>Enter Content</p>
                </div>
                <input id="button-submit" type="button" value="Submit" onClick={this.onSubmit.bind(this)} />
            </div>
        );
    }
}

class WorkListItems extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: props.data
        };
    }
    componentDidMount(){
        //when Work is rendered to DOM for first time (init)

        //Get Work Data
        this.getWorkData();
        //Listeners
    }

    componentWillUnmount(){
        //when DOM produced by Work is removed
    }

    getWorkData(){
        var component = this;
        $.get('/work/get', function(jsondata){
            component.setState({'data':JSON.parse(jsondata)});
        });
    }

    render() {
        console.log("Rendering WorkListItems");
        console.log(this.state);
        var entries = [];
        for (var i=0; i<this.state.data.length; i++){
            entries.push(
                <WorkListItem key={this.state.data[i].id} name={this.state.data[i].name} />
            );
        }
        return (
            <ul>
                {entries}
            </ul>
        );
    }
}

var WorkListItem = function(props){
    return (
        <li key={props.id}>{props.name}</li>
    );
}


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            workListData:[],
            quilData:[]
        };
    }
    componentDidMount(){
        //when Work is rendered to DOM for first time (init)
    }

    componentWillUnmount(){
        //when DOM produced by Work is removed
    }

    addWorkItem(name, content){
        var data = this.data;
        console.log(data);
        console.log('Name:'+name);
        console.log('Content:'+content);
    }

    render() {
        return (
            <div>
                <QuilForm data={this.state.quilData}  addWorkItem={this.addWorkItem}/>
                <WorkListItems data={this.state.workListData}/>
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