import React, {Component, PropTypes} from 'react';
import { RaisedButton, Styles } from 'material-ui';
let { Spacing, Typography } = Styles;
let DefaultRawTheme = Styles.LightRawTheme;

export default class HowWorks extends Component {
  constructor() {
    super();
  }

  getStyles() {
  //    let desktopGutter = Styles.Spacing.desktopGutter;
    let padding = 400;
    let styles = {
      contentContainerStyle: {
        paddingTop: Spacing.desktopKeylineIncrement
      },
      headlineMain: {
        fontSize: 36,
        lineHeight: '15px',
        paddingTop: 8,
        marginTop: 24,
        marginBottom: 16,
        letterSpacing: 0,
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textDarkBlack
      },
      headline: {
        fontSize: 30,
        lineHeight: '15px',
        paddingTop: 8,
        marginTop: 24,
        marginBottom: 16,
        letterSpacing: 0,
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textDarkBlack
      }
    };
    return styles;
  }

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.contentContainerStyle}>
        <div style={{textAlign: 'center'}}><h1 style={styles.headlineMain}>How SagePath Works</h1></div>
        <div>
          <h1 style={styles.headline}>Step 1: Narrow down Options</h1>
          <p>The first step to building a successful career is to choose the role(s) you want to play in tackling the world’s many challenges. In SagePath, these roles are called Focus. Within each Focus, there are specific paths you can take, depending on the industry of interest.</p>
          <p>(Image here showing the big picture)</p>
          <p>In order to explore the paths relevant to you, you must first select (1) Focus, and (2) Industries in the Explorer. The Explorer allows you to like/dislike categories and helps you narrow down to the ones you are most interested in.</p>
          <p>(SS of like/dislike button -> like/dislike icons)</p>
          <p>Once you have selected a few paths/industries, we show you all the different career paths that require your selected combinations. We’ve analyzed every focus, industry, and path that exist, so rest assured that you’re not missing out on anything.</p>

          <h1 style={styles.headline}>Step 2: Choose your path</h1>
          <p>After narrowing down your preferences, the option to ‘declare’ a path will become available. The path(s) you declare (up to 3) will become your goals, which SagePath will help by tracking progress and suggesting ways to improve*.</p>
          <p>*Note that in order to declare a path, you must declare its required Industry and Focus (also up to 3).</p>

          <h1 style={styles.headline}>Step 3: Build skills</h1>
          <p>For each path, we’ve analyzed the in-demand skills, so you know which skills to work on to succeed in your path(s) of choice. Start building these skills via courses, extracurriculars, and internships!</p>
        </div>
      </div>
    );
  }

}

HowWorks.propTypes = {
};
