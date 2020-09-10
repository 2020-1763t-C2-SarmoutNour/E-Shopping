import React, { useEffect } from 'react';
import { Dimmer } from 'semantic-ui-react';
import VerticalSlider from './verticalSlider';
import TopCategoriesAndBrands from './topCategoriesAndBrands';
import {
  StyledSegment,
  StyledDimmer,
} from '../../../styles/semanticUI/customStyles';
import { connect, useSelector } from 'react-redux';
import { DocumentTitle } from '../../ui/documentTitle';
import { getDataViaAPI } from '../../../actions';
import { homePageDataReducer } from '../../../reducers/screens/commonScreenReducer';
import HomeMenuIcons from './homeMenuIcons';
import Hidden from '@material-ui/core/Hidden';
import Spinner from '../../ui/spinner';
import { HTTPError } from '../../ui/error/httpError';
import { LOAD_HOME_PAGE } from '../../../actions/types';
import { BadRequest } from '../../ui/error/badRequest';
import { HOME_PAGE_DATA_API } from '../../../constants/api_routes';
import { HOME_PAGE_API_OBJECT_LEN } from '../../../constants/constants';

const Home = (props) => {
  const { hover } = useSelector((state) => state.tabHoverEventReducer);
  const homeAPIData = useSelector((state) => state.homePageDataReducer);

  useEffect(() => {
    if (!homeAPIData.hasOwnProperty('data')) {
      props.getDataViaAPI(LOAD_HOME_PAGE, HOME_PAGE_DATA_API);
    }
  }, [homePageDataReducer]);

  if (homeAPIData.isLoading) {
    return <Spinner />;
  } else {
    if (
      homeAPIData.hasOwnProperty('data') &&
      Object.entries(homeAPIData.data).length !== HOME_PAGE_API_OBJECT_LEN
    ) {
      return <BadRequest />;
    } else if (homeAPIData.hasOwnProperty('statusCode')) {
      return <HTTPError statusCode={homeAPIData.statusCode} />;
    }
  }

  return (
    <Dimmer.Dimmable as={StyledSegment} dimmed={hover}>
      <DocumentTitle title="Online Shopping for Women, Men, Kids Fashion & Lifestyle - Shoppers" />
      <Hidden only={['xs', 'lg']}>
        <HomeMenuIcons />
      </Hidden>
      <Hidden only={['xs']}>
        <VerticalSlider />
      </Hidden>
      <TopCategoriesAndBrands />
      <StyledDimmer active={hover} />
    </Dimmer.Dimmable>
  );
};

export default connect(null, { getDataViaAPI })(Home);
