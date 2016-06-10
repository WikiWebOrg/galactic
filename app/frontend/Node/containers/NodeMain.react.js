import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from 'react-loader';
import Navbar from "../../components/Navbar.react"
import EntityItem from "../../components/Entity/"
import EdgeConnection from "../../components/EdgeConnection"
import TagsInput from "../components/TagsInput.react"

import { Alert, Tooltip, OverlayTrigger  } from "react-bootstrap"
import { getNode, postNodeTags } from "../actions/index"

class NodeMain extends Component {

  constructor() {
     super()
     const messageFlag = window.location.search.search((/message=true/))
     this._handleAlertDismiss = this._handleAlertDismiss.bind(this)
     this.state = {
       messageFlag: messageFlag!=-1?true:false,
       imgError: false
     }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getNode(window.location.pathname.replace('/node/',''))) //@todo include this in the page
  }

  render() {
    const that = this;
    const { nodeResult, user } = this.props
    const { messageFlag, imgError } = this.state

    if (!nodeResult || Object.keys(nodeResult).length==0) {
      return (
      <div>
        <Navbar/>
        <Loader top={'30%'} />
      </div>)
    }

    const { superEdges, imageCDN, faviconCDN, title, entityCount, canonicalLink, description, _id } = nodeResult

    const connectHref = "/connect?url="+canonicalLink

    let documentImageSrc ='/img/document.png';
    if (imgError){
      //no opperation
    } else if(imageCDN.url){
      documentImageSrc = imageCDN.url
    }else if (faviconCDN){
      documentImageSrc = faviconCDN
    }

    const nodeEdges = superEdges.map(function(superEdge, i){

      const { users, entity, edges, entityCount } = superEdge;

      let tags = edges.map(edge=>edge.tags).reduce((a, b)=>a.concat(b));

      const userId = user?user.user._id:null;
      const currentUserEdgeId = that._getCurrentUserEdgeId(edges, userId); //Has the user created an edge to tag along this route?
      const tagsInputJSX = currentUserEdgeId ?
        <TagsInput
          tags={tags}
          id={currentUserEdgeId}
          />:null;

      return (
        <div
          key={i}
          style={{padding:'5px 0px'}}
          className='default-card'
          >
          <EntityItem
            count={entityCount}
            imageCDN={entity.imageCDN.url?entity.imageCDN.url:''}
            faviconCDN={entity.faviconCDN?entity.faviconCDN:''}
            canonicalLink={entity.canonicalLink}
            title={entity.title}
            description={entity.description}
            id={entity._id}
          />
          <EdgeConnection
            edges={edges}
            index={0}
          />
          <div style={{display: 'block', overflow: 'hidden', border: 'none', marginTop: '3px'}}>
            <div className="card-left-col">
              <img src="../../img/blank.png" />
            </div>
            <div
              className="card-right-col"
              style={{ paddingLeft: '5px', paddingRight: '20px'}}>
              {tagsInputJSX}
            </div>
          </div>
        </div>)
    });

    const tooltip = (
      <Tooltip id="emptyNodeTooltip" className="wikiweb-tooltip">When you connect two URLs together, you are helping to grow the WikiWeb since other people can find those connections later.</Tooltip>
    );

    const emptyMessage = nodeEdges.length==0?
    <div>
      <h3>Shucks! There are no connections to this site <i>yet</i>.</h3>
      <p>
        You chould be the first to&nbsp;
        <b><a href={connectHref}>create one</a></b>.
          <OverlayTrigger placement="top" overlay={tooltip}>
            <sup>
            <span className="fa fa-info-circle" style={{color: '#337ab7'}}></span>
            </sup>
          </OverlayTrigger>
      </p>
    </div>
    :null;

    let descriptionClipped = ''
    if (description.length > 200){
      descriptionClipped = description.slice(0,200)+"..."
    } else {
      descriptionClipped = description
    }

    const href = '/node/'+_id;
    const entityCountJSX = <a
      href={href}
      title="number of connections"
      className="badge badge-default badge-styling connect-icon"
      style={entityCount > 9?{paddingLeft: '3px', paddingRight: '3px'}:{}}>
      {entityCount}</a>

    // let entityCountJSX =
    // <a
    //   href = {'/node/'+_id}
    //   className="badge badge-default badge-styling connect-icon">
    //   {entityCount}
    // </a>
    //
    // if (entityCount > 9){
    //   entityCountJSX =
    //   <span
    //     title="number of connections"
    //     className="badge badge-default badge-styling connect-icon"
    //     style={{paddingLeft: '3px', paddingRight: '3px'}}>
    //     {entityCount}
    //   </span>
    // }
    let sourceURL=document.createElement('a')
    sourceURL.href=canonicalLink

    return (
      <div style={{backgroundColor:'white'}}>
        <Navbar />
        <div  className="container"
              style={{
                paddingTop:'40px',
                marginBottom: '40px',
                backgroundColor: 'white'}}>
          <div className='row'>
            <div className={
              ['col-xs-12',
              'col-sm-10',
              'col-sm-offset-1',
              'col-md-8',
              'col-md-offset-2'].join(' ')
              }>

            <div style={{display: 'block', overflow: 'hidden'}}>
              <div className="card-left-col">
                <span>
                  <img
                  src={documentImageSrc}
                  style={{
                    maxWidth: '50px',
                    paddingTop:'20px'}}
                  onError={this._handleImageErrored.bind(this)}
                  />
                </span>
              </div>
              <div  className="card-right-col"
                    style={{paddingLeft: '5px', paddingRight: '5px'}}>
                <h3>{title.length>0?
                      title:
                      sourceURL.host+(sourceURL.pathname.length>1?sourceURL.pathname:'')}
                </h3>
                <div>
                  {entityCountJSX}
                  <a  href={canonicalLink}
                      className="noUnderline"
                      style={{marginLeft: '5px'}}>
                  <span>{sourceURL.host}</span>
                  </a>
                </div>
                <div style={{fontSize:'14px', paddingTop: '8px'}}>{descriptionClipped}</div>
                <a href={connectHref}>
                   <button
                     type="button"
                     className="btn btn-default invertibleButton"
                     style={{marginTop: '10px', border: '1px solid orange'}}>
                     Add a connection
                   </button>
                 </a>
              </div>
             </div>

            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgb(225, 232, 237)',
          backgroundColor: '#F5F8FA',
          paddingTop: '5px'}}>
          <div className="container" >
            <div className='row'>
              <div className={
                ['col-xs-12',
                'col-sm-10',
                'col-sm-offset-1',
                'col-md-8',
                'col-md-offset-2'].join(' ')
                }>
                {messageFlag && superEdges[0]?
                  <Alert bsStyle="success" onDismiss={this._handleAlertDismiss}>
                    <h4>You added a new Connection!</h4>
                    <p>Now add tags to show why they're connected.</p>
                  </Alert>
                 :null}
                <div className={messageFlag?'highlight-first':''}>
                  {nodeEdges}
                </div>
                <div>
                  {emptyMessage}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
  _addTag(input){
    this.props.dispatch( postNodeTags(id, this.state.tagInput.split(' ') ));
  }

  _handleAlertDismiss(){
    this.setState({
      messageFlag:false
    })
  }

  _getCurrentUserEdgeId(edges, userId){
    const currentUserEdge = edges.find(e=>e.user._id==userId);
    return currentUserEdge?currentUserEdge._id:null;
  }

  _handleImageErrored(){
    this.setState({
      imgError:true
    })
  }

}

function mapStateToProps(state) {
  const { nodeResult, edgeResult, userResult } = state;
  let user = null;
  if ( userResult && userResult.success ){
    user = userResult;
  }
  return {
    nodeResult,
    edgeResult,
    userResult,
    user
  }
}


export default connect(mapStateToProps)(NodeMain)
