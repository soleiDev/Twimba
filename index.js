import { tweetsData as initialTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tweetsData = loadFromLocalStorage() || initialTweetsData

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.replybtn){
        handleReplyBtnClick(e.target.dataset.replybtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveToLocalStorage()
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveToLocalStorage()
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    console.log(tweetInput.value)
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@HelloKitty 🎀ྀིྀི`,
            profilePic: `images/hellokitty.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isReplied: false,
            uuid: uuidv4()
        })
        saveToLocalStorage()
        render()
        tweetInput.value = ''
    }
}

function handleReplyBtnClick(tweetId) {
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    
    if( replyInput.value ) {
        const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]

        targetTweetObj.replies.push({
            handle: `@HelloKitty 🎀ྀིྀི`,
            profilePic: `images/hellokitty.png`,
            tweetText: replyInput.value,
        })

        targetTweetObj.isReplied = !targetTweetObj.isReplied

        saveToLocalStorage()
        render()

        document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
        replyInput.value = ''
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tweets-data', JSON.stringify(tweetsData))
}

function loadFromLocalStorage() {
    const storedData = localStorage.getItem('tweets-data')
    return storedData ? JSON.parse(storedData) : null
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let replyIconClass = ''

        if (tweet.isReplied){
            replyIconClass = 'replied'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                        </div>
                    </div>
                `
            })
        }
        
          
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots ${replyIconClass}"
                                data-reply="${tweet.uuid}" id="comment-icon"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <div class="reply-input-area">
                                <img src="images/hellokitty.png" class="profile-pic">
                                <textarea class="reply-input" placeholder="Tweet your reply" id="reply-input-${tweet.uuid}"></textarea>
                            </div>
                        </div>
                        <button class="reply-btn" id="reply-btn" data-replybtn="${tweet.uuid}">Reply</button>
                    </div>
                </div>   
            </div>
        `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()