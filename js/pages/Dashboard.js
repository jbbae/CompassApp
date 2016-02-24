//require('styles/pages/Dashboard.sass');

import React, {Component} from 'react';
import { FloatingActionButton, Paper, Styles, Tab, Tabs } from 'material-ui';
let { Colors, Spacing, Transitions, Typography } = Styles;
//let ThemeManager = Styles.ThemeManager;

export default class Dashboard extends Component {
  getStyles() {
    let desktopGutter = Styles.Spacing.desktopGutter;
    let padding = 400;
    let styles = {
      root: {
        paddingTop: Spacing.desktopKeylineIncrement + 'px'
      },
      rootWhenMedium: {
        paddingTop: Spacing.desktopKeylineIncrement + 'px',
        position: 'relative'
      },
      contentContainerStyle: {
        marginLeft: -padding
      },
      div: {
        position: 'absolute',
        left: 48,
        backgroundColor: Colors.cyan500,
        width: padding,
        height: 48
      },
      headline: {
        fontSize: 24,
        lineHeight: '32px',
        paddingTop: 16,
        marginBottom: 12,
        letterSpacing: 0,
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textDarkBlack
      },
      iconButton: {
        position: 'absolute',
        left: 0,
        backgroundColor: Colors.cyan500,
        color: 'white',
        marginRight: padding
      },
      iconStyle: {
        color: Colors.white
      },
      tabs: {
        position: 'relative'
      },
      tabsContainer: {
        position: 'relative',
        paddingLeft: padding
      },
      //Styles for Paper Component
      paperRoot: {
        transition: Transitions.easeOut(),
        maxWidth: '300px',
        margin: '0 auto ' + desktopGutter + ' auto'
      },
      paperRootWhenMedium: {
        float: 'left',
        width: '33%',
        marginRight: '4px',
        marginBottom: '0px'
      },
      planWrappers: {
        display: 'inline-block',
        width: '33%',
        maxWidth: '300px',
        margin: '0 auto ' + desktopGutter + ' auto'
      },
      image: {
        //Not sure why this is needed but it fixes a display
        //issue in chrome
        marginBottom: -6
      }
    };
  //    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
  //        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
  //      styles.paperRoot = this.mergeAndPrefix(
  //        styles.paperRoot,
  //        styles.paperRootWhenMedium
  //      );
  //    }

//  if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
//      this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
//    styles.root = this.mergeStyles(styles.root, styles.rootWhenMedium);
//  }

    return styles;
  }

  render() {
    let styles = this.getStyles();

    return (
        <div className="dashboard" style={styles.rootWhenMedium}>
          <h1 style={styles.headline} id="pageTitle">My Dashboard</h1>
          <Paper zDepth={1} className="sectionPaper">
            <div className="sectionWrap">
              <div className="stages">
                <div className="stageButt"><FloatingActionButton iconClassName="muidocs-icon-action-grade" /></div>
                <div className="stageButt"><FloatingActionButton iconClassName="muidocs-icon-action-grade" /></div>
              </div>
              <div className="stages">
                <div className="stageButt"><FloatingActionButton iconClassName="muidocs-icon-action-grade" /></div>
              </div>
              <div className="stages">
                <p>Step1</p>
                <p>Step2</p>
                <p>Step3</p>
              </div>
            </div>
          </Paper>
          <Paper zDepth={1} className="sectionPaper">
            <Tabs>
              <Tab label="Focus 1" >
                <div className="tabcontent">
                  <Paper
                    className="skill"
                    zDepth={2}>
                    C++
                  </Paper>
                  <Paper
                    className="skill"
                    zDepth={2}>
                    Microsoft Excel Macros!
                  </Paper>
                  <Paper
                    className="skill"
                    zDepth={2}>
                    Javascript
                  </Paper>
                </div>
              </Tab>
              <Tab label="Focus 2" >
                <div className="tabcontent">
                  <Paper
                    className="skill"
                    zDepth={2}>
                    C++
                  </Paper>
                  <Paper
                    className="skill"
                    zDepth={2}>
                    Microsoft Excel Macros!
                  </Paper>
                  <Paper
                    className="skill"
                    zDepth={2}>
                    Javascript
                  </Paper>
                </div>
              </Tab>
              <Tab label="Focus 3">
                <div className="tabcontent">
                  <Paper
                    className="skill"
                    zDepth={2}>
                    C++
                  </Paper>
                  <Paper
                    className="skill"
                    zDepth={2}>
                    Microsoft Excel Macros!
                  </Paper>
                  <Paper
                    className="skill"
                    zDepth={2}>
                    Javascript
                  </Paper>
                </div>
              </Tab>
            </Tabs>
          </Paper>
        <Paper className="sectionPaper">
          <div className="sectionWrap">
            <div style={styles.planWrappers}>
              <Paper zDepth={2} circle={true} className="planBlock">
                <p>Plan A</p>
              </Paper>
            </div>
            <div style={styles.planWrappers}>
              <Paper zDepth={2} circle={true} className="planBlock">
                <p>Plan B</p>
              </Paper>
            </div>
            <div style={styles.planWrappers}>
              <Paper zDepth={2} circle={true} className="planBlock">
                <p>Plan C</p>
              </Paper>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}
