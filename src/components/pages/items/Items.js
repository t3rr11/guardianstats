import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import * as extendedItems from '../../scripts/Items';
import * as checks from '../../scripts/Checks';

export class Items extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Items...' },
    data: null
  }

  componentDidMount() {
    this.startUpChecks();
  }

  async startUpChecks() {
    this.setState({ status: { status: 'checkingManifest', statusText: 'Checking Manifest...' } });
    if(checks.checkManifestMounted()) {
      const check = await checks.startUpPageChecks();
      if(check === "Checks OK") {
        this.setState({ status: { status: 'getActivities', statusText: 'Loading Items...' } });
        this.getItems();
      }
      else {
        this.setState({ status: { status: 'error', statusText: checks } });
      }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }

  async getItems() {
    const data = await extendedItems.getItemData();
    this.setState({ status: { error: null, status: 'completed', statusText: 'Finished loading item data.' }, data });
  }

  getItemInfo(hash, request) {
    const { data } = this.state;
    if(request === "name") {
      var name = data.ManifestCollectibles[hash].displayProperties.name;
      if(name !== "") { return <div className="title">{ name }</div> } else { return null; }
    }
    else if(request === "description") {
      var description = data.ManifestCollectibles[hash].displayProperties.description;
      if(description !== "") { return <div className="description">{ description }</div> } else { return null; }
    }
    else if(request === "requirements") {
      var requirements = data.ManifestCollectibles[hash].stateInfo.requirements.entitlementUnavailableMessage;
      if(requirements !== "") { return <div className="requirements">{ requirements }</div> } else { return null; }
    }
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { data } = this.state;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'completed') {
      return (
        <div id="itemCategories" className="scrollbar">
          {
            data.PresentationNodes[data.ExoticNode.hash].children.presentationNodes.map(category => (
              <div key={ category.presentationNodeHash } id={ category.presentationNodeHash } className="itemSubCategory">
                <p className="itemSubCategoryTitle">{ data.PresentationNodes[category.presentationNodeHash].displayProperties.name }</p>
                {
                  data.PresentationNodes[category.presentationNodeHash].children.presentationNodes.map(node => (
                    <div key={ node.presentationNodeHash } id={ node.presentationNodeHash } className="itemCollectibleCategory">
                      <p className="itemCollectibleCategoryTitle">{ data.PresentationNodes[node.presentationNodeHash].displayProperties.name }</p>
                      {
                        data.PresentationNodes[node.presentationNodeHash].children.collectibles.map(collectible => (
                          <div key={ collectible.collectibleHash } id={ collectible.collectibleHash } className="collectibleItemContainer">
                            <img alt='Icon' src={ 'https://bungie.net' + data.ManifestCollectibles[collectible.collectibleHash].displayProperties.icon } className={ data.ManifestCollectibles[collectible.collectibleHash].obtained ? 'collectibleItemImage' : 'collectibleItemImage notAcquired' } />
                            <div className="collectibleItemInfo">
                              { this.getItemInfo(collectible.collectibleHash, "name") }
                              { this.getItemInfo(collectible.collectibleHash, "description") }
                              { this.getItemInfo(collectible.collectibleHash, "requirements") }
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      );
    }
    else {
      return <Loader statusText={ statusText } />
    }
  }
}

export default Items;
