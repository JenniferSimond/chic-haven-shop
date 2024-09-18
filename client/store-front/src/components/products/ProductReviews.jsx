import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { getToken } from "../shared/auth";
import { CustomerContext } from "../../CustomerContext";
import { fetchReviewsByProduct, createReview } from "../../api/reviews";
import windowResize from "../shared/hooks/windowResize";
import diamondFilled from '../../assets/icons-svg/reviewDiamond/diamondFilled.svg';
import diamondGrey from '../../assets/icons-svg/reviewDiamond/diamondGrey.svg';
import halfDiamond from '../../assets/icons-svg/reviewDiamond/halfDiamond.svg';
import reviewAccount from '../../assets/icons-svg/account/reviewAccount.svg'

const WebReview = styled.div`
   
width: 700px;
width: 100%;
`;


const MobileView = styled.div`

`;

const RatingWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 5%;
    background-color: rgb(var(--purple-mid));
    width: 700px;
    max-width: 80%;
    padding: 2%;
    align-items: center;
    border-radius: 3px;
    border: 2px solid rgb(var(--purple-mid));
`;

const InnerRatingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 350px;
    height: 100%;
    max-width: 70%;
    // background-color: pink;
     
`;

const DiamondWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8%;
    justify-content: center;
    max-width: 400px;
    min-height: 40px;
    width: 80%;
    margin-left: 10%;
    align-items: center;
`;

const SvgIcon = styled.img`
    max-height: ${props => props.maxHeight || '35px'};
    max-width: ${props => props.maxWidth || '35px'};
    height: ${props => props.height ||'12%'};
    width: ${props => props.width ||'12%'};
    
`;

const ReviewInput = styled.textarea`
    border: none;
    background-color: rgba(var(--cream), 1);
    
    min-height: 20px;
    max-height: 90%;
    
    margin: 2% 10%;
    color: rgba(var(--purple-mid), 0.8);
    border: 3px solid rgba(var(--cream), 1);
    border-radius: 3px;
    padding: 2%;
    font-size: 15px;
    font-family: Montserrat, sans-serif;

    &::placeholder {
        color: rgba(var(--purple-mid), 0.8);
    }

    &:focus {
        border-color: rgb(var(--purple-light));
    }
`;

const Button = styled.button`
  width: 68px;
  height: 68px;
  border: none;
  border-radius: 50%;
  background-color: rgb(var(--cream));
  color: rgb(var(--purple-deep));
  font-family: Montserrat;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.30px;
  text-transform: capitalize;
  margin-top: 2%;
    

   @media (max-width: 1300px) {
    width: 58px;
    height: 58px;
    font-size: 11px;
    font-weight: 700;
  }
   @media (max-width: 1050px) {
    width: 54px;
    height: 54px;
    font-size: 10px;
    font-weight: 700;
  }

  &:hover {
    background-color: rgb(var(--purple-light));
    color: rgb(var(--cream));
    font-weight: 700;
  }
`;


const ReviewWrapper = styled.div`

    display: flex;
    flex-direction: column;

    margin-top: 2%;
    width: 700px;
    min-height: 210px;
    max-height: 90%;
    max-width: 80%;
    padding: 2%;
    border: 2px solid rgb(var(--purple-mid));
    border-radius: 3px;
`;

const ReviewRatingWrapper = styled.div`
    display: flex;
    flex-direction: row;
    background-color:
    min-height: 50px;
    background-color: rgb(var(--purple-mid));
    border-radius: 3px;
    align-items: center;
    padding: 1%;
    gap: 4%;
    justify-content: center;
     
    
`;

const ReviewDiamondWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5%;
    justify-content: center;
    max-width: 180px;
    min-height: 30px;
    width: 80%;
    align-items: center;
`;

const ReviewTitle = styled.h3`
    font-family: Montserrat;
    font-size: 25px;
    color: rgb(var(--purple-mid));
    text-align: center;
    font-style: italic;
    font-weight: 500;
    // letter-spacing: 1.32px;
    margin-bottom: 10px;
    letter-spacing: 1.5px;
`;



const AverageRating = styled.p`
      color: rgb(var(--cream));
  font-family: Montserrat;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.215px;
`;

const ReviewsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 120px;
     width: 600px;
    max-width: 100%;
    margin-top: 2%;
    // background-color: grey;
    gap: 5px;
`;

const CustomerReviewWrapper = styled.div`
    display: flex;
    flex-direction: column;
   
    gap: 1%;
    height: 40px;
    border-radius: 3px;
    border: 1px solid rgb(var(--purple-mid));
    padding: 0% 1.5%;
   
`;


const InnerReview = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 700px;
    width: 100%;
    height: 100%;
    gap: 2%;
`;

const ReviewerName = styled.div`
     display: flex;
        flex-direction: row;
        width: 20%;
        min-width: 80px;
        // margin: 0px 5px 0px 9px;
    p { 
        
        color: rgb(var(--purple-mid));
        font-family: Cinzel;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 1px;
        
    }
`;


const ReviewCommentWrapper = styled.div`
        display: flex;
        flex-direction: row;
        width: 70%;
        min-width: 130px;
    //    background-color: pink;
    p {
        font-size: 13px;
        color: rgb(var(--ras-pink));
    }
`;




const ProductReviews = ({selectedProduct}) => {
    const {width} = windowResize();
    const token = getToken();
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [averageRating, setAverageRating] = useState(0);

    const {customerData} = useContext(CustomerContext);
    
    useEffect(() => {
        const getProductReviews = async () => {
            try {
                const productReviews = await fetchReviewsByProduct(selectedProduct.id);
                console.log('Product Reviews (reviews) --> ',productReviews);

                if (productReviews && Array.isArray(productReviews)) {
                    setReviews(productReviews);
                    const avgRating = productReviews.reduce((accumulator, review) =>  accumulator + parseFloat(review.rating), 0) / productReviews.length;
                    setAverageRating(avgRating);
                    console.log('Average Rating ->',averageRating)
                } else {
                    setReviews([]);
                    setAverageRating(0);
                }
            } catch (error) {
                console.error("Error fetching product reviews:", error);
                setReviews([]);
                setAverageRating(0);
            }
        }
        getProductReviews();
    }, [selectedProduct.id])

    const handleRatingClick = (value) => {
        setNewRating(value)
    }

    const handleCommentChange = (event) => {
        setNewComment(event.target.value)
    }

    const handleReviewSubmit = async () => {
        try {
            
        } catch (error) {
            
        }
    }


    return(
        <>
            {width <= 950 ? (
                <MobileView>

                </MobileView>
            ) : (
                <WebReview>

                <RatingWrapper>
                    <InnerRatingWrapper>
                    <DiamondWrapper>
                        {[1,2,3,4,5].map((value) => (
                            <SvgIcon 
                                key={value}
                                src={value <= newRating ? diamondFilled : diamondGrey}
                                 onClick={()=> handleRatingClick(value)}                         
                            />
                        ))}
                    </DiamondWrapper>
                    <ReviewInput 
                        spellCheck="true"
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Leave a review here!"
                    />

                    </InnerRatingWrapper>
                    <Button>Submit</Button>
                </RatingWrapper>
                <ReviewWrapper>
                    <ReviewRatingWrapper>
                        
                        <AverageRating>{averageRating.toFixed(1)}{''} Diamonds</AverageRating>
                    
                        <ReviewDiamondWrapper>

                       
                        {[1, 2, 3, 4, 5].map((value) => (
                            <SvgIcon
                            maxHeight={'60px'}
                            maxWidth={'60px'}
                            width={'15%'}
                            height={'15%'}
                            key={value}
                            src={value <= averageRating ? diamondFilled : diamondGrey}
                            alt={`${value} star`}
                            />
                        ))}
                        </ReviewDiamondWrapper>
                    </ReviewRatingWrapper>
                    <ReviewsWrapper>
                        {reviews.length === 0 ?(
                            <p>Be the first to leave a review!</p>
                        ): (
                            reviews.map((review) => (
                                <CustomerReviewWrapper key={review.id}>
                                    <InnerReview>
                                        <SvgIcon 
                                            maxHeight={'24px'}
                                            maxWidth={'24px'}
                                            width={'100%'}
                                            height={'100%'}
                                            src={reviewAccount}
                                        />
                                       <ReviewerName>
                                        <p>{review.first_name}:</p>
                                       </ReviewerName>
                                        <ReviewCommentWrapper>
                                            <p>{review.comment}</p>
                                        </ReviewCommentWrapper>
                                        
                                    </InnerReview>
                                   
                                </CustomerReviewWrapper>
                            ))
                        )}
                    </ReviewsWrapper>
                </ReviewWrapper>
                        
                </WebReview>
            )}
        </>
    )
}

export default ProductReviews;