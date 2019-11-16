import React, { Component } from 'react';
import Loader from '../../modules/Loader';
import Error from '../../modules/Error';
import * as Misc from '../../Misc';

import * as globals from '../../scripts/Globals';
import * as bungie from '../../requests/BungieReq';
import * as checks from '../../scripts/Checks';

export class Vendors extends Component {

  state = {
    status: { error: null, status: 'startUp', statusText: 'Loading Vendors...' },
    manifest: null,
    vendors: null
  }

  async componentDidMount() {
    this.startUpChecks();
  }

  async startUpChecks() {
    this.setState({ status: { status: 'checkingManifest', statusText: 'Checking Manifest...' } });
    if(checks.checkManifestMounted()) {
      const check = await checks.startUpPageChecks();
      if(check === "Checks OK") {
        this.setState({ status: { status: 'getActivities', statusText: 'Loading Vendors...' } });
        this.getVendors();
      }
      else {
        this.setState({ status: { status: 'error', statusText: check } });
      }
    }
    else { setTimeout(() => { this.startUpChecks(); }, 1000); }
  }

  async getVendors() {
    const accountInfo = JSON.parse(localStorage.getItem("SelectedAccount"));
    const characterId = localStorage.getItem("SelectedCharacter");
    const vendors = await bungie.GetVendors(Misc.getPlatformType(accountInfo.platform), accountInfo.id, characterId);
    this.setState({ status: { status: 'ready', statusText: 'Finished Loading...' }, manifest: globals.MANIFEST, vendors });
  }

  render() {
    document.body.style.backgroundImage = "var(--DarkNavyBlue)";
    
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
                                  <img alt={ itemData.displayProperties.name } src={ `https://bungie.net${ itemData.displayProperties.icon }` } className="vendorIcon" />
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
                                                  <img alt={ costData.displayProperties.name } src={ `https://bungie.net${ costData.displayProperties.icon }` } className="costIcon" />
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
                            return null;
                          })
                        }
                      </div>
                    </div>
                  )
                }
              }
              return null;
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
