import React from "react";
import diamondFilled from "../../../assets/icons-svg/reviewDiamond/diamondFilled.svg";
import diamondGrey from "../../../assets/icons-svg/reviewDiamond/diamondGrey.svg";
import styled from "styled-components";

const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgb(var(--purple-mid));
    width: 46%;
    height: 11%;
    min-width: 420px;
    max-height: 200px;
    padding: 0% 4%;
    font-family: Montserrat, sans-serif;
    border-radius: 3px;
`;

const InnerCardWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 2%;
`;

const LeftInnerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 50%;
    width: 40%;
    gap: 10%;

    p {
        font-family: Cinzel;
        font-size: 18px;
        color: rgb(var(--cream));
        letter-spacing: .6px;
        font-weight: 600;
        text-align: center;
    }
`;

const ReviewDiamondWrapper = styled.div`
align-self: center;
    display: flex;
    flex-direction: row;
    gap: ${props => props.$gap || '5px'};;
    justify-content: center;
    width: 52%;
    align-items: center;
`;

const SvgIcon = styled.img`
    max-height: ${props => props.$maxHeight || '25px'};
    max-width: ${props => props.$maxWidth || '25px'};
    height: ${props => props.$height ||'100%'};
    width: ${props => props.$width ||'100%'};
    
`;

const CommentWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--cream));
    padding: 4% 3%; 
    width: 55%;   
    border-radius: 3px;
   

    p {
        font-family: Montserrat, sans-serif;
         text-align: center;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.5px;
        color: rgb(var(--purple-dark));
    }
`;


const ReviewCard = ({review}) => {
    const reviewRating = review.rating
    return(
       <CardWrapper>
        <InnerCardWrapper>

            <LeftInnerWrapper>
                <p>{review.product_name}</p>
                <ReviewDiamondWrapper>
                                        
                {[1, 2, 3, 4, 5].map((value) => (
                    <SvgIcon
                    key={value}
                    $maxHeight={'30px'}
                    $maxWidth={'30px'}
                    $width={'55%'}
                    $height={'55%'}
                    src={value <= reviewRating ? diamondFilled : diamondGrey}
                    alt={`${value} diamond`}
                    />
                ))}
                </ReviewDiamondWrapper>
                
            </LeftInnerWrapper>
        <CommentWrapper>
            <p>{review.comment}</p>
        </CommentWrapper>
        </InnerCardWrapper>
       </CardWrapper>
    )
}

export default ReviewCard