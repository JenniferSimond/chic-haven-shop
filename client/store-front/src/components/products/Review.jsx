import React, {useState, useEffect} from "react";
import styled from "styled-components";
import { getToken } from "../shared/auth";
import diamondFilled from '../../assets/icons-svg/reviewDiamond/diamondFilled.svg';
import diamondGrey from '../../assets/icons-svg/reviewDiamond/diamondGrey.svg';
import { fetchReviewsByProduct, createReview } from "../../api/reviews";


const WebReviewWrapper = styled.div`

`;

