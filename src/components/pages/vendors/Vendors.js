import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';

import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';

export class Vendors extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Vendors...' },
    manifest: null,
    vendors: null
  }

  async componentDidMount() {
    this.getVendors();
  }

  async getVendors() {
    const basicMI = JSON.parse(localStorage.getItem('BasicMembershipInfo'));
    const characterId = localStorage.getItem('SelectedCharacter');
    const vendors = await bungie.GetVendors(basicMI.membershipType, basicMI.membershipId, characterId);
    this.setState({ status: { status: 'ready', statusText: 'Finished Loading...' }, manifest: globals.MANIFEST, vendors });
  }

  render() {
    //Define Consts and Variables
    const { status, statusText } = this.state.status;
    const { manifest, vendors } = this.state;

    //Check for errors, show loader, or display content.
    if(status === 'error') { return <Error error={ statusText } /> }
    else if(status === 'ready') {
      return (
        <div className="vendors inspectBoxScrollbar">
          {
            Object.keys(vendors.sales.data).map(function(vendor) {
              const vendorSales = vendors.sales.data[vendor];
              const manifestVendorInfo = manifest.DestinyVendorDefinition[vendor];
              const ignoredVendors = ["2255782930", "3466008634", "3190557734", "460529231", "1796504621"];
              if(Object.keys(vendorSales.saleItems).length > 1) {
                if(!ignoredVendors.find(e => e === vendor)) {
                  return (
                    <div key={ vendor } className="vendorContainer" id={ vendor }>
                      <div className="vendorTitleBox">{ manifestVendorInfo.displayProperties.name }</div>
                      <div className="vendorBox">
                        {
                          Object.keys(vendorSales.saleItems).map(function(vendorItem) {
                            const itemData = manifest.DestinyInventoryItemDefinition[vendorSales.saleItems[vendorItem].itemHash];
                            if(itemData.displayProperties.icon !== "/img/misc/missing_icon_d2.png" && itemData.displayProperties.name !== "") {
                              return (
                                <div key={ itemData.hash } className="vendorIconBox">
                                  <img src={ `https://bungie.net${ itemData.displayProperties.icon }` } className="vendorIcon" />
                                  <div className="vendorItemInfo">
                                    <div className="title">{ itemData.displayProperties.name !== "" ? itemData.displayProperties.name : "No Title" }</div>
                                    <div className="description">{ itemData.displayProperties.description !== "" ? itemData.displayProperties.description : "No Description" }</div>
                                    {
                                      vendorSales.saleItems[vendorItem].costs.length > 0 ? (
                                        <div className="costs">
                                          {
                                            vendorSales.saleItems[vendorItem].costs.map(function(cost) {
                                              var costData = manifest.DestinyInventoryItemDefinition[cost.itemHash];
                                              return (
                                                <div key={ cost.itemHash } className="costContainer">
                                                  <img src={ `https://bungie.net${ costData.displayProperties.icon }` } className="costIcon" />
                                                  <div className="costName">{ costData.displayProperties.name }</div>
                                                  <div className="costAmount">{ cost.quantity }</div>
                                                </div>
                                              )
                                            })
                                          }
                                        </div>
                                      ) : null
                                    }
                                  </div>
                                </div>
                              )
                            }
                          })
                        }
                      </div>
                    </div>
                  )
                }
              }
            })
          }
          <div></div>
        </div>
      );
    }
    else { return <Loader statusText={ statusText } /> }
  }
}

export default Vendors;
