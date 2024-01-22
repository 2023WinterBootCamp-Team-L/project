// QueryList.tsx
import { useState, useEffect } from "react";
import AddButton from "../components/AddButton";
import BackButton from "../components/BackButton";
import BaseQuest from "../components/BaseQuest";
import { useNavigate } from "react-router-dom";
import { useQuestionContext } from "../components/QuestionUpdate";
import { QuestionList } from "../components/QuestionList";
import Modal from "../components/Modal";
import axios from "axios";

export interface Question {
  questions?: Question[] | undefined;
  value: string;
  onTextChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  context: string;
  type: "객관식" | "주관식";
  choices?: string[];
}
interface ApiResponse {
  status: "success" | "error";
  questions?: Question[];
  error_code?: number;
  message?: string;
}

function QueryList() {
  const [questions, setQuestions] = useState<Question[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post<ApiResponse>(
          "http://localhost:8000/api/questions/",
          {
            user_id: 4,
            questions: questions
            // [
            //   {
            //     context: "당신의 직무는 무엇인가요?",
            //     type: "객관식",
            //     choices: ["개발자", "디자이너", "기획자", "PM,PO", "기타직무"],
            //   },
            //   {
            //     context: "님의 업무 능력 강점은 무엇인가요?",
            //     type: "객관식",
            //     choices: ["박학다식", "기획력", "문제 분석", "효율적인", "계획적인", "위기대처능력", "정보수집", "추진력", "규칙준수", "창의적인", "리더십", "전략적인", "의견다양성", "결단력", "협력적인"],
            //   },
            //   {
            //     context: "님의 성격 및 태도는 어떤가요?",
            //     type: "객관식",
            //     choices: ["책임감", "공감능력", "경청하는", "성실함", "배려심", "적극적인", "꼼꼼함", "끈기", "분위기메이커", "주도적인", "긍정적인", "사교성이 좋은", "관대한", "도전적인", "센스있는"],
            //   },
            //   {
            //     context: "님에게 전하고 싶은 칭찬이 있나요?",
            //     type: "주관식",
            //   },
            //   {
            //     context: "님이 보완해 줬으면 하는 부분이 있나요?",
            //     type: "주관식",
              // },
            // ],
          }
        );

        if (response.data.status === "success") {
          console.log("성공적으로 등록되었습니다.");
          setQuestions(response.data.questions);
        } else {
          console.error(
            `Error: ${response.data.error_code}, ${response.data.message}`
          );
        }
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    };

    fetchData();
  }, [questions]);

  // 페이지 이동
  const navigate = useNavigate();
  const handleAddButtonClick = () => {
    navigate("/queryadd");
  };
  const handleQuestionComplete = () => {
    navigate("/queryshare");
  };
  // 모달
  const { questions: contextQuestions } = useQuestionContext();
  const [isOpen, setisOpen] = useState(false);
  const toggle = () => {
    setisOpen(!isOpen);
  };
  return (
    <div className="flex flex-col overflow-hidden w-[24.56rem] mx-auto h-[53.25rem] px-5 py-8 gap-4">
      <div className="flex justify-between">
        <BackButton back page="/querystart" />
        <BackButton back={false} onClick={toggle} />
      </div>
      <p className="text-2xl">질문 리스트</p>
      <div className="flex flex-col gap-2">
        <p className="text-xl">기본 질문</p>
        <BaseQuest text="당신의 직무는 무엇인가요?" />
        <BaseQuest color={false} text="00님의 업무 능력 강점은 무엇인가요?" />
        <BaseQuest text="00님의 성격 및 태도는 어떤가요?" />
        <BaseQuest color={false} text="00님에게 전하고 싶은 칭찬이 있나요?" />
        <BaseQuest text="00님이 보완해줬으면 하는 부분이 있나요?" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xl">추가 질문</p>
        <AddButton
          text="새로운 질문을 추가해보세요"
          onClick={handleAddButtonClick}
        />
        <QuestionList questions={contextQuestions} />
      
      </div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <div className="flex flex-col items-center gap-4">
          <div className="space-y-1">
            <p className="text-xl font-bold">이대로 질문폼을 완성하시겠어요?</p>
            <p className="text-md text-center">
              완성된 폼은
              <span className="text-c-green font-bold"> 수정할 수 없어요</span>
            </p>
          </div>
          <button
            onClick={handleQuestionComplete}
            className="bg-c-indigo text-white w-full px-2 py-2 rounded-xl mt-4 text-lg"
          >
            질문폼 완성
          </button>
        </div>
      </Modal>
    </div>
  );
}
export default QueryList;