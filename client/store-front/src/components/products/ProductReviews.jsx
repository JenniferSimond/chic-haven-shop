import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { getToken } from "../shared/auth";
import { CustomerContext } from "../../CustomerContext";
import { fetchReviewsByProduct, createReview } from "../../api/reviews";
import windowResize from "../shared/hooks/windowResize";
import diamondFilled from '../../assets/icons-svg/reviewDiamond/diamondFilled.svg';
import diamondGrey from '../../assets/icons-svg/reviewDiamond/diamondGrey.svg';
import reviewAccount from '../../assets/icons-svg/account/reviewAccount.svg'

const WebView = styled.div`

   display: flex;
//    flex-grow: 1;
   justify-content: center;
   flex-direction: column;
   align-items: center;
   justify-content: center;
`;


const MobileView = styled.div`
    display: flex;
   justify-content: center;
   flex-direction: column;
   align-items: center;
   justify-content: center;
`;

const LoginMessageText = styled.p`
    font-family: Montserrat, sans-serif;
        font-size: ${props => props.$fontSize || '14px'};
        font-style: italic;
        font-weight: 600;
        color: rgb(var(--purple-mid));
        letter-spacing: 0.5px;
        margin-bottom: 2px;

`;


const RatingWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 5%;
    background-color: rgb(var(--purple-mid));
    width: ${props => props.$width || '450px'};;
    max-width: ${props => props.$maxWidth || '70%'};
    padding: 2%;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 3px;
    border: 2px solid rgb(var(--purple-mid));

    @media (max-width: 950px) {
        min-width: 40%;
        height: 85px;
    }
`;

// Outside wrapper for customer rating area
const InnerRatingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 250px;
    height: 90%;
    max-width: 70%;

    @media (max-width: 950px) {
        width: 200px;
    }
     
`;

const DiamondWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${props => props.$gap || '8%'};
    align-content center;
    align-items: center;    
    justify-content: center;
    max-width: 260px;
    min-height: 15px;
    width: 100%;
    margin-bottom: 3%;

 
`;


const SvgIcon = styled.img`
    max-height: ${props => props.$maxHeight || '25px'};
    max-width: ${props => props.$maxWidth || '25px'};
    height: ${props => props.$height ||'100%'};
    width: ${props => props.$width ||'100%'};
    
`;

const ReviewInput = styled.textarea`
    border: none;
    background-color: rgba(var(--cream), 1);
    
    min-height: ${props => props.$minHeight || '20px'};
    max-width: 250px;
    color: rgba(var(--purple-mid), 0.8);
    border: 3px solid rgba(var(--cream), 1);
    border-radius: 3px;
    padding-left: 1%;
    font-size: ${props => props.$fontSize || '13px'};
    font-family: Montserrat, sans-serif;

    &::placeholder {
        color: rgba(var(--purple-mid), 0.8);
    }

    &:focus {
        border-color: rgb(var(--purple-light));
    }

    @media (max-width: 950px) {
     max-width: 200px;
    }
`;

const Button = styled.button`
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: rgb(var(--cream));
  color: rgb(var(--purple-deep));
  font-family: Montserrat, sans-serif;
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
    

   @media (max-width: 1300px) {
    width: 45px;
    height: 45px;
    font-size: 9px;

  }
   @media (max-width: 1050px) {
    width: 42px;
    height: 42px;
    font-size: 8px;
  }
   @media (max-width: 950px) {
    width: 40px;
    height: 40px;
    font-size: 8px;
  }

  &:hover {
    background-color: rgb(var(--purple-light));
    color: rgb(var(--cream));
    font-weight: 700;
  }
`;

// Wrapper for product reviews
const ReviewWrapper = styled.div`

    display: flex;
    flex-direction: column;
    margin-top: ${props => props.$marginTop || '1%'};
    width: ${props => props.$width || '450px'};
    min-height: 60px;
    max-height: ${props => props.$maxHeight || '70%'};
    max-width: ${props => props.$maxWidth || '70%'};
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
    padding:  1% 2%;
    gap: 4%;
    justify-content: center;
     
    @media (max-width 950px) {
        min-height: 60px;
    }
`;

const ReviewDiamondWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${props => props.$gap || '5%'};;
    justify-content: center;
    max-width: 170px;
    min-height: 0px;
    width: 85%;
    align-items: center;
`;

const AverageRating = styled.p`
  color: rgb(var(--cream));
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.215px;
`;

// Outer Wrapper for Product
const ReviewsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: ${props => props.$height ||'120px'};
     width: ${props => props.$width || '450px'};
    max-width: 100%;
    margin-top: ${props => props.$marginTop || '2%'};
    gap: 8px;
    overflow-x: hidden;
    overflow-y: auto;
   

&::-webkit-scrollbar {
  width: 5px;
  border-radius: 3px;
}



&::-webkit-scrollbar-track {
  background: rgba(var(--cream),1);
  border-radius: 5px;
  border: 2px solid rgb(var(--cream));
  background-clip: content-box; 
  
}

&::-webkit-scrollbar-thumb {
  background:rgba(var(--purple-mid), 1);
  width: 5px;
  
  border-radius: 1px;

}
`;

const CustomerReviewWrapper = styled.div`
    display: flex;
    flex-direction: column;
    // min-height: 40px;
    max-height: 120px;
    gap: 1%;
   
    border-radius: 3px;
    border: 1px solid rgb(var(--purple-mid));
    padding: 4px 4px;
    margin: 0% 1%;
   
`;


const InnerReview = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-left: 3px;
    gap: 2%;
`;

const ReviewerName = styled.div`
     display: flex;
        flex-direction: row;
        width: 20%;
        margin-right: 1%;
        min-width: 65px;

        
    p { 
        
        color: rgb(var(--purple-mid));
        font-family: Cinzel;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        
    }

    @media (max-width: 950px) {
        width: 10%;
      p {
            font-size: 11px;
        }
    }


`;


const ReviewCommentWrapper = styled.div`
        display: flex;
        flex-direction: row;
        width: 70%;
        margin-right: 1%;
        
   
    p {
        font-family: Montserrat, sans-serif;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.5px;
        color: rgb(var(--ras-pink));
    }

     @media (max-width: 950px) {


     p {
            font-size: 11px;
            font-weight: 500;
        }
    
}
`;


const ProductReviews = ({selectedProduct, viewMobileReviews}) => {
    const {width} = windowResize();
    const token = getToken();
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [averageRating, setAverageRating] = useState(0);
   

    const {customerData} = useContext(CustomerContext);

    if (!selectedProduct) {
        return <div>Product Not Found! 🤦🏽‍♀️</div>;
      }
    
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

        if (selectedProduct.id) {
            getProductReviews();

        }
        
    }, [selectedProduct.id, reviews.length])

  

    const handleRatingClick = (value) => {
        setNewRating(value)
        console.log('New Rating ->',newRating);
    }

    const handleCommentChange = (event) => {
        setNewComment(event.target.value)
        console.log(newComment);
    }

    const handleReviewSubmit = async () => {

        if (!customerData.id) {
            setNewRating(0);
            setNewComment('')
            return;
        }

        if (newRating === 0 || newComment.trim() === ""){
            return;
        }
        try {
            const newReview = await createReview(token, selectedProduct.id, customerData.id, newRating, newComment );
            console.log('New Review -->', newReview);
            setReviews([...reviews, newReview])
            const newAvgRating = [...reviews, newReview].reduce((accumulator, review) => accumulator + review.rating, 0) / (reviews.length + 1) //all reviews + new review
            setAverageRating(newAvgRating);
            setNewRating(0);
            setNewComment('')
        } catch (error) {
            console.error('Error submitting review', error)
        }
    };


    return(
        <>
            {width <= 950 ? (
                <MobileView>
                    
                     { !viewMobileReviews ? (
                                        <>
                                        { !customerData.id ? 
                                       (<LoginMessageText>Please log in to leave a review</LoginMessageText>) : (
                                        <></>
                                       )
                                    }
                                        <RatingWrapper $maxWidth={'80%'}>
                                          
                                        <InnerRatingWrapper>
                                        <DiamondWrapper $gap={'8%'}>
                                            {[1,2,3,4,5].map((value) => (
                                                <SvgIcon 
                                                $maxHeight={'20px'}
                                                $maxWidth={'20px'}
                                                $width={'70%'}
                                                $height={'70%'}
                                                key={value}
                                                src={value <= newRating ? diamondFilled : diamondGrey}
                                                onClick={()=> handleRatingClick(value)}                         
                                                />
                                            ))}
                                        </DiamondWrapper>
                                        <ReviewInput 
                                            $minHeight={'10px'}
                                            $fontSize={'11px'}
                                            spellCheck="true"
                                            type="text"
                                            value={newComment}
                                            onChange={handleCommentChange}
                                            placeholder="Leave a review here!"
                                        />
                    
                                        </InnerRatingWrapper>
                                        <Button onClick={handleReviewSubmit}>Submit</Button>
                                    </RatingWrapper>
                                    </>
                    ) : (
                        //see existing reviews
                        <ReviewWrapper $width={'500px'} $maxWidth={'80%'} $maxHeight={'100%'} $marginTop={'0%'}>
                    <ReviewRatingWrapper>
                        
                        <AverageRating>{averageRating.toFixed(1)}{''} Diamonds</AverageRating>
                    
                        <ReviewDiamondWrapper>

                       
                        {[1, 2, 3, 4, 5].map((value) => (
                            <SvgIcon
                            key={value}
                            $maxHeight={'20px'}
                            $maxWidth={'20px'}
                            $width={'10%'}
                            $height={'10%'}
                            src={value <= averageRating ? diamondFilled : diamondGrey}
                            alt={`${value} diamond`}
                            />
                        ))}
                        </ReviewDiamondWrapper>
                    </ReviewRatingWrapper>
                    <ReviewsWrapper $height={'70px'} >
                        {reviews.length === 0 ?(
                            <p>Be the first to leave a review!</p>
                        ): (
                            reviews.map((review) => (
                                <CustomerReviewWrapper key={review.id}>
                                    <InnerReview>
                                        <SvgIcon 
                                            $maxHeight={'15px'}
                                            $maxWidth={'15px'}
                                            $width={'80%'}
                                            $height={'80%'}
                                            src={reviewAccount}
                                        />
                                       <ReviewerName key={review.id}>
                                        <p>{review.first_name}:</p>
                                       </ReviewerName>
                                        <ReviewCommentWrapper  key={review.id}>
                                            <p>{review.comment}</p>
                                        </ReviewCommentWrapper>
                                        
                                    </InnerReview>
                                   
                                </CustomerReviewWrapper>
                            ))
                        )}
                    </ReviewsWrapper>
                </ReviewWrapper>
                    
                    )}
                    
                </MobileView>
            ) : (
                <WebView>
                   { !customerData.id ? 
                        (<LoginMessageText $fontSize={'16px'}>Please log in to leave a review</LoginMessageText>) : (
                            <></>
                         )
                    }
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
                    <Button onClick={handleReviewSubmit}>Submit</Button>
                </RatingWrapper>
                <ReviewWrapper>
                    <ReviewRatingWrapper>
                        
                        <AverageRating>{averageRating.toFixed(1)}{''} Diamonds</AverageRating>
                    
                        <ReviewDiamondWrapper>

                       
                        {[1, 2, 3, 4, 5].map((value) => (
                            <SvgIcon
                            $maxHeight={'20px'}
                            key={value}
                            $maxWidth={'30px'}
                            $width={'10%'}
                            $height={'10%'}
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
                                            $maxHeight={'20px'}
                                            $maxWidth={'20px'}
                                            $width={'80%'}
                                            $height={'80%'}
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
                        
                </WebView>
            )};
        </>
    )
}

export default ProductReviews;