import React from 'react';
import Paragraph from './paragraph.jsx';

class Test extends React.Component {
  render() {

    var rows = [];
    for (let i = 0; i < 1000; i++) {
      let pKey = i.toString();
      rows.push(<Paragraph key={pKey}/>);
    }

    return (
      <div>
        {rows}
      </div>
    )
  }
}

export default Test;
