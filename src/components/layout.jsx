import React from 'react';

const Row = React.memo(function(props) {
  return (
    <div className="row">
      {props.children}
    </div>
  ); 
});

const Col = React.memo(function(props) {
  return (
    <div className={`col-lg-${props.size} p-4`}>
      <div className={'rounded bg-white p-4'}>
        {props.children}
      </div>
    </div>
  )
})

export { Row, Col };