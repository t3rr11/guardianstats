import React, { Component } from 'react';
import Loader from '../modules/Loader';
import Error from '../modules/Error';

import * as checks from '../scripts/Checks';
import * as extendedItems from '../scripts/Items';

export class Items extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Items...' },
    data: null
  }

  async getItems() {
    try {
      const data = await extendedItems.getItemData();
      this.setState({ status: { error: null, status: 'completed', statusText: 'Finished loading item data.' }, data });
    }
    catch (err) {
      this.setState({ status: { error: 'NotSelectedPlatform', status: 'error', statusText: 'You have not selected your platform yet.' } });
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
                            <div className="collectibleItemInfo">{ data.ManifestCollectibles[collectible.collectibleHash].displayProperties.name }</div>
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
      if(status === 'startUp') { this.getItems(); }
      return <Loader statusText={ statusText } />
    }
  }
}

export default Items;
