import axios from 'axios';
import BackButton from '../components/BackButton';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TagAnswer from '../components/TagAnswer';
import 디자이너 from '../assets/디자이너.svg';
import { useNavigate } from 'react-router-dom';

interface Feedback {
  feedback_id: string;
  respondent_name: string;
  tag_work: string;
  tag_attitude: string;
  tags_work_parsed: string[];
  tags_attitude_parsed: string[];
}

const FeedbackList: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const storedUserid = localStorage.getItem('user_id');
    if (storedUserid) {
      setApiUrl(
        `http://localhost:8000/api/feedbacks/response/list/?user_id=${storedUserid}&category=${category}`
      );
    }
  }, [category]);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const parseTags = (tagsString: string) => {
    try {
      return tagsString
        .replace(/^\[|\]$/g, '') // Remove square brackets
        .split(', ') // Split by comma and space
        .map((tag) => tag.replace(/^'|'$/g, '')); // Remove single quotes from the beginning and end
    } catch (error) {
      console.error('Error parsing tags:', error);
      return [];
    }
  };

  const getFeedbacks = async () => {
    try {
      const response = await axios.get(apiUrl);

      if (response.data.status === 'success') {
        const parsedFeedbacks = response.data.feedbacks.map(
          (feedback: Feedback) => ({
            ...feedback,
            tags_work_parsed: parseTags(feedback.tag_work),
            tags_attitude_parsed: parseTags(feedback.tag_attitude),
          })
        );

        setFeedbacks(parsedFeedbacks);
        console.log(response.data);
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, [apiUrl]);

  useEffect(() => {
    console.log(feedbacks);
  }, [feedbacks]);

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="bg-white flex flex-col min-h-screen gap-10 px-5 py-8 overflow-hidden w-full sm:w-[393px] lg:w-[393px]"
        // style={{ width: '393px' }}
      >
        <div>
          <BackButton back page="/mainpage" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-pre text-[22px] font-bold">
            {category}의 피드백
          </div>
          {filteredFeedbacks.length === 0 ? (
            <p className="font-pre text-[14px] text-gray-400">
              받은 피드백 목록이 없습니다.
            </p>
          ) : (
            <ul>
              {filteredFeedbacks.map((feedback, index) => (
                <li
                  key={feedback.feedback_id}
                  className={`h-50 w-full flex flex-col justify-start p-4 rounded-lg border-2 ${
                    index % 2 === 0
                      ? 'bg-c-l-blue border-c-blue'
                      : 'bg-c-l-purple border-c-sl-purple'
                  } mb-4`}
                >
                  <div>
                    <button
                      className="font-pre text-[14px] font-bold mb-2"
                      onClick={() =>
                        navigate(
                          `/feedbackresult/${feedback.respondent_info.respondent_name}`
                        )
                      }
                    >
                      {feedback.respondent_info.respondent_name} {category}님의
                      피드백
                    </button>
                    <div className="flex tags-attitude">
                      {feedback.tags_work.map((tag) => (
                        <TagAnswer key={tag} text={tag} image={디자이너} />
                      ))}
                    </div>
                    <div className="flex gap-1 tags-attitude">
                      {feedback.tags_attitude.map((tag) => (
                        <TagAnswer key={tag} text={tag} image={디자이너} />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;
