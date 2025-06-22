
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Phone, Users, Scissors, Trophy, PlayCircle, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
}

const MONEY_LADDER = [
  "$100", "$200", "$300", "$500", "$1,000",
  "$2,000", "$4,000", "$8,000", "$16,000", "$32,000",
  "$64,000", "$125,000", "$250,000", "$500,000", "$1,000,000"
];

const SAFE_POINTS = [4, 9]; // $1,000 and $32,000

const QUESTIONS: Question[] = [
  // Easy Questions (1-5)
  {
    id: 1,
    category: "Geography",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    difficulty: 1
  },
  {
    id: 2,
    category: "Science",
    question: "How many legs does a spider have?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    difficulty: 1
  },
  {
    id: 3,
    category: "History",
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    difficulty: 2
  },
  {
    id: 4,
    category: "Literature",
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    difficulty: 2
  },
  {
    id: 5,
    category: "Sports",
    question: "How many players are on a basketball team on court at one time?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    difficulty: 2
  },
  // Medium Questions (6-10)
  {
    id: 6,
    category: "Science",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    difficulty: 3
  },
  {
    id: 7,
    category: "Geography",
    question: "Which river is the longest in the world?",
    options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
    correctAnswer: 1,
    difficulty: 3
  },
  {
    id: 8,
    category: "History",
    question: "Who was the first person to walk on the moon?",
    options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
    correctAnswer: 1,
    difficulty: 3
  },
  {
    id: 9,
    category: "Art",
    question: "Which artist painted 'The Starry Night'?",
    options: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Claude Monet"],
    correctAnswer: 2,
    difficulty: 4
  },
  {
    id: 10,
    category: "Science",
    question: "What is the speed of light in vacuum?",
    options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"],
    correctAnswer: 0,
    difficulty: 4
  },
  // Hard Questions (11-15)
  {
    id: 11,
    category: "History",
    question: "In which year was the Berlin Wall torn down?",
    options: ["1987", "1988", "1989", "1990"],
    correctAnswer: 2,
    difficulty: 5
  },
  {
    id: 12,
    category: "Literature",
    question: "Who wrote 'One Hundred Years of Solitude'?",
    options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Jorge Luis Borges", "Octavio Paz"],
    correctAnswer: 1,
    difficulty: 5
  },
  {
    id: 13,
    category: "Science",
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: 2,
    difficulty: 5
  },
  {
    id: 14,
    category: "Geography",
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
    correctAnswer: 2,
    difficulty: 5
  },
  {
    id: 15,
    category: "Physics",
    question: "What is the name of the theoretical boundary around a black hole?",
    options: ["Event Horizon", "Photon Sphere", "Ergosphere", "Singularity"],
    correctAnswer: 0,
    difficulty: 5
  }
];

const Index = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [finalAnswer, setFinalAnswer] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [wonAmount, setWonAmount] = useState('$0');
  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    askAudience: false,
    phoneAFriend: false
  });
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [audienceResults, setAudienceResults] = useState<number[] | null>(null);
  const [friendSuggestion, setFriendSuggestion] = useState<number | null>(null);
  const [showLifelineDialog, setShowLifelineDialog] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentPrize = MONEY_LADDER[currentQuestionIndex];

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFinalAnswer(null);
    setGameOver(false);
    setWonAmount('$0');
    setUsedLifelines({ fiftyFifty: false, askAudience: false, phoneAFriend: false });
    setHiddenOptions([]);
    setAudienceResults(null);
    setFriendSuggestion(null);
    toast({
      title: "Game Started!",
      description: "Good luck on your journey to $1,000,000!",
    });
  };

  const selectAnswer = (answerIndex: number) => {
    if (hiddenOptions.includes(answerIndex)) return;
    setSelectedAnswer(answerIndex);
  };

  const confirmAnswer = () => {
    if (selectedAnswer === null) return;
    setFinalAnswer(selectedAnswer);
    setShowConfirmDialog(true);
  };

  const submitFinalAnswer = () => {
    if (finalAnswer === null) return;
    
    setShowConfirmDialog(false);
    
    if (finalAnswer === currentQuestion.correctAnswer) {
      // Correct answer
      const newAmount = MONEY_LADDER[currentQuestionIndex];
      setWonAmount(newAmount);
      
      if (currentQuestionIndex === QUESTIONS.length - 1) {
        // Won the game!
        setGameState('finished');
        toast({
          title: "CONGRATULATIONS! 🎉",
          description: "You've won $1,000,000!",
        });
      } else {
        // Next question
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setFinalAnswer(null);
          setHiddenOptions([]);
          setAudienceResults(null);
          setFriendSuggestion(null);
          toast({
            title: "Correct!",
            description: `You've won ${newAmount}!`,
          });
        }, 1500);
      }
    } else {
      // Wrong answer
      let finalAmount = '$0';
      // Check for safe points
      if (currentQuestionIndex > SAFE_POINTS[1]) {
        finalAmount = MONEY_LADDER[SAFE_POINTS[1]];
      } else if (currentQuestionIndex > SAFE_POINTS[0]) {
        finalAmount = MONEY_LADDER[SAFE_POINTS[0]];
      }
      
      setWonAmount(finalAmount);
      setGameOver(true);
      setGameState('finished');
      toast({
        title: "Game Over!",
        description: `The correct answer was ${currentQuestion.options[currentQuestion.correctAnswer]}. You leave with ${finalAmount}.`,
        variant: "destructive"
      });
    }
  };

  const walkAway = () => {
    const currentAmount = currentQuestionIndex > 0 ? MONEY_LADDER[currentQuestionIndex - 1] : '$0';
    setWonAmount(currentAmount);
    setGameState('finished');
    toast({
      title: "You walked away!",
      description: `You leave with ${currentAmount}.`,
    });
  };

  const useFiftyFifty = () => {
    if (usedLifelines.fiftyFifty) return;
    
    setUsedLifelines(prev => ({ ...prev, fiftyFifty: true }));
    
    // Hide 2 wrong answers
    const wrongAnswers = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctAnswer);
    const toHide = wrongAnswers.slice(0, 2);
    setHiddenOptions(toHide);
    
    toast({
      title: "50/50 Used!",
      description: "Two wrong answers have been removed.",
    });
  };

  const useAskAudience = () => {
    if (usedLifelines.askAudience) return;
    
    setUsedLifelines(prev => ({ ...prev, askAudience: true }));
    
    // Generate audience results (weighted towards correct answer)
    const results = [0, 0, 0, 0];
    const correctAnswer = currentQuestion.correctAnswer;
    
    // Give correct answer 40-70% of votes
    results[correctAnswer] = Math.floor(Math.random() * 31) + 40;
    
    // Distribute remaining votes
    let remaining = 100 - results[correctAnswer];
    for (let i = 0; i < 4; i++) {
      if (i !== correctAnswer && remaining > 0) {
        const vote = Math.floor(Math.random() * remaining);
        results[i] = vote;
        remaining -= vote;
      }
    }
    results[correctAnswer] += remaining;
    
    setAudienceResults(results);
    setShowLifelineDialog('audience');
  };

  const usePhoneAFriend = () => {
    if (usedLifelines.phoneAFriend) return;
    
    setUsedLifelines(prev => ({ ...prev, phoneAFriend: true }));
    
    // Friend suggests correct answer 80% of the time
    const suggestion = Math.random() < 0.8 ? 
      currentQuestion.correctAnswer : 
      Math.floor(Math.random() * 4);
    
    setFriendSuggestion(suggestion);
    setShowLifelineDialog('friend');
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-gradient-to-br from-yellow-400 to-orange-500 border-none shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-900" />
              <h1 className="text-4xl font-bold text-purple-900 mb-2">Who Wants to be a</h1>
              <h2 className="text-3xl font-bold text-purple-900">MILLIONAIRE?</h2>
            </div>
            <p className="text-purple-800 mb-6 text-lg">
              Answer 15 questions correctly to win $1,000,000!
            </p>
            <Button 
              onClick={startGame}
              className="bg-purple-900 hover:bg-purple-800 text-white px-8 py-3 text-xl font-bold rounded-full shadow-lg"
            >
              <PlayCircle className="w-6 h-6 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-gradient-to-br from-yellow-400 to-orange-500 border-none shadow-2xl">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-900" />
            <h1 className="text-3xl font-bold text-purple-900 mb-4">
              {wonAmount === '$1,000,000' ? 'CONGRATULATIONS!' : gameOver ? 'Game Over!' : 'Well Played!'}
            </h1>
            <p className="text-purple-800 mb-6 text-xl">
              You won: <span className="text-2xl font-bold">{wonAmount}</span>
            </p>
            <div className="space-y-3">
              <Button 
                onClick={startGame}
                className="w-full bg-purple-900 hover:bg-purple-800 text-white py-3 text-lg font-bold rounded-full"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button 
                onClick={() => setGameState('menu')}
                variant="outline"
                className="w-full border-purple-900 text-purple-900 hover:bg-purple-100 py-3 text-lg font-bold rounded-full"
              >
                <Home className="w-5 h-5 mr-2" />
                Main Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Prize Money */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-none shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-purple-900">Question {currentQuestionIndex + 1} of 15</h2>
                  <p className="text-purple-800">Playing for: <span className="text-xl font-bold">{currentPrize}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-purple-800">Current Winnings:</p>
                  <p className="text-2xl font-bold text-purple-900">{wonAmount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Money Ladder */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="bg-black/50 border-yellow-400 shadow-lg">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Prize Ladder</h3>
                <div className="space-y-1">
                  {MONEY_LADDER.slice().reverse().map((amount, index) => {
                    const actualIndex = MONEY_LADDER.length - 1 - index;
                    const isCurrent = actualIndex === currentQuestionIndex;
                    const isPassed = actualIndex < currentQuestionIndex;
                    const isSafePoint = SAFE_POINTS.includes(actualIndex);
                    
                    return (
                      <div
                        key={actualIndex}
                        className={`p-2 rounded text-center font-bold ${
                          isCurrent 
                            ? 'bg-yellow-400 text-black animate-pulse' 
                            : isPassed 
                              ? 'bg-green-600 text-white' 
                              : isSafePoint
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {actualIndex + 1}. {amount}
                        {isSafePoint && <span className="ml-2">🛡️</span>}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Question */}
            <Card className="bg-black/50 border-yellow-400 shadow-lg">
              <CardContent className="p-6">
                <Badge className="mb-4 bg-purple-600 text-white">{currentQuestion.category}</Badge>
                <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
                
                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {currentQuestion.options.map((option, index) => {
                    const isHidden = hiddenOptions.includes(index);
                    const isSelected = selectedAnswer === index;
                    const letter = String.fromCharCode(65 + index); // A, B, C, D
                    
                    return (
                      <Button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        disabled={isHidden}
                        className={`p-4 h-auto text-left justify-start ${
                          isHidden 
                            ? 'opacity-30 cursor-not-allowed bg-gray-600' 
                            : isSelected
                              ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        <span className="font-bold mr-3">{letter}:</span>
                        <span>{isHidden ? '---' : option}</span>
                      </Button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={confirmAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold px-6"
                  >
                    Final Answer
                  </Button>
                  <Button
                    onClick={walkAway}
                    variant="outline"
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white font-bold px-6"
                  >
                    Walk Away
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lifelines */}
            <Card className="bg-black/50 border-yellow-400 shadow-lg">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Lifelines</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={useFiftyFifty}
                    disabled={usedLifelines.fiftyFifty}
                    className={`${
                      usedLifelines.fiftyFifty 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-500'
                    } text-white font-bold`}
                  >
                    <Scissors className="w-4 h-4 mr-2" />
                    50/50
                  </Button>
                  <Button
                    onClick={useAskAudience}
                    disabled={usedLifelines.askAudience}
                    className={`${
                      usedLifelines.askAudience 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-500'
                    } text-white font-bold`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Ask Audience
                  </Button>
                  <Button
                    onClick={usePhoneAFriend}
                    disabled={usedLifelines.phoneAFriend}
                    className={`${
                      usedLifelines.phoneAFriend 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-500'
                    } text-white font-bold`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Friend
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Final Answer Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gradient-to-br from-yellow-400 to-orange-500 border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-900">Final Answer?</DialogTitle>
            <DialogDescription className="text-purple-800 text-lg">
              Are you sure you want to select: <br />
              <strong>{finalAnswer !== null ? `${String.fromCharCode(65 + finalAnswer)}: ${currentQuestion.options[finalAnswer]}` : ''}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-center mt-4">
            <Button 
              onClick={submitFinalAnswer}
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-8"
            >
              Yes, Final Answer!
            </Button>
            <Button 
              onClick={() => setShowConfirmDialog(false)}
              variant="outline"
              className="border-purple-900 text-purple-900 hover:bg-purple-100 font-bold px-8"
            >
              No, Let me reconsider
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lifeline Results Dialogs */}
      <Dialog open={showLifelineDialog === 'audience'} onOpenChange={() => setShowLifelineDialog(null)}>
        <DialogContent className="bg-black border-yellow-400">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-yellow-400">Ask the Audience Results</DialogTitle>
          </DialogHeader>
          {audienceResults && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-white font-bold w-8">{String.fromCharCode(65 + index)}:</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-8 relative">
                    <div 
                      className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${audienceResults[index]}%` }}
                    >
                      <span className="text-white font-bold text-sm">{audienceResults[index]}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button onClick={() => setShowLifelineDialog(null)} className="w-full mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showLifelineDialog === 'friend'} onOpenChange={() => setShowLifelineDialog(null)}>
        <DialogContent className="bg-black border-yellow-400">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-yellow-400">Phone a Friend</DialogTitle>
          </DialogHeader>
          <div className="text-white">
            <p className="mb-4">"Hi! I think the answer is..."</p>
            {friendSuggestion !== null && (
              <p className="text-xl font-bold text-yellow-400">
                {String.fromCharCode(65 + friendSuggestion)}: {currentQuestion.options[friendSuggestion]}
              </p>
            )}
            <p className="mt-4 text-gray-300">"But I'm not 100% sure. Good luck!"</p>
          </div>
          <Button onClick={() => setShowLifelineDialog(null)} className="w-full mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
