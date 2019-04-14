import React from 'react';
import { Editor, EditorState } from 'draft-js';

class CreateNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.onChange = (editorState) => this.setState({ editorState });
    }

    render() {
        return (
            <form>
                <input type="text" name="title" />
                <Editor editorState={this.state.editorState} onChange={this.onChange} />
            </form>
        )
    }
}

export default CreateNote;