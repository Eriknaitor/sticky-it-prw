import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import ProgressRing from './Progress-ring';

const MAX_LENGTH = 500;


class CreateNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty(), progress: 0 };
        this.onChange = (editorState) => this.setState({ editorState, progress: (this.state.editorState.getCurrentContent().getPlainText().length * 100) / 500 });
    }

    _onClick = (e) => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, e.target.name));
    }

    _getLengthOfSelectedText = () => {
        const currentSelection = this.state.editorState.getSelection();
        const isCollapsed = currentSelection.isCollapsed();

        let length = 0;

        if (!isCollapsed) {
            const currentContent = this.state.editorState.getCurrentContent();
            const startKey = currentSelection.getStartKey();
            const endKey = currentSelection.getEndKey();
            const startBlock = currentContent.getBlockForKey(startKey);
            const isStartAndEndBlockAreTheSame = startKey === endKey;
            const startBlockTextLength = startBlock.getLength();
            const startSelectedTextLength = startBlockTextLength - currentSelection.getStartOffset();
            const endSelectedTextLength = currentSelection.getEndOffset();
            const keyAfterEnd = currentContent.getKeyAfter(endKey);

            if (isStartAndEndBlockAreTheSame) {
                length += currentSelection.getEndOffset() - currentSelection.getStartOffset();
            } else {
                let currentKey = startKey;

                while (currentKey && currentKey !== keyAfterEnd) {
                    if (currentKey === startKey) {
                        length += startSelectedTextLength + 1;
                    } else if (currentKey === endKey) {
                        length += endSelectedTextLength;
                    } else {
                        length += currentContent.getBlockForKey(currentKey).getLength() + 1;
                    }

                    currentKey = currentContent.getKeyAfter(currentKey);
                };
            }
        }

        return length;
    }

    _handleBeforeInput = () => {
        const currentContent = this.state.editorState.getCurrentContent();
        const currentContentLength = currentContent.getPlainText('').length;
        const selectedTextLength = this._getLengthOfSelectedText();

        if (currentContentLength - selectedTextLength > MAX_LENGTH - 1) {
            console.log('Límite de caracteres alcanzados: 500');

            return 'handled';
        }
    }

    _handlePastedText = (pastedText) => {
        const currentContent = this.state.editorState.getCurrentContent();
        const currentContentLength = currentContent.getPlainText('').length;
        const selectedTextLength = this._getLengthOfSelectedText();

        if (currentContentLength + pastedText.length - selectedTextLength > MAX_LENGTH) {
            console.log('Límite de caracteres alcanzados: 500');

            return 'handled';
        }
    }


    render() {
        const styles = ['BOLD', 'ITALIC', 'UNDERLINE', 'CODE', 'STRIKETHROUGH'];
        const buttons = styles.map(style => {
            return <button key={style} onClick={this._onClick} name={style}>{style}</button>
        });

        return (
            <div className="container-root">
                <input type="text" name="title" />
                <div>{buttons}</div>
                <Editor
                    placeholder="Contenido de la nota..."
                    editorState={this.state.editorState}
                    handleBeforeInput={this._handleBeforeInput}
                    handlePastedText={this._handlePastedText}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange} />
                <ProgressRing radius={10} stroke={2} progress={this.state.progress} strokeColor={'red'} />
            </div>
        )
    }
}

export default CreateNote;