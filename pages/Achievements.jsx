import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Zap, Target, Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";

const achievementIcons = {
  Trophy,
  Star,
  Award,
  Zap,
  Target,
  Shield
};

export default function Achievements() {
  const [achievements] = useState([
    { 
      id: 1, 
      title: "First Transaction", 
      description: "Complete your first USDT exchange", 
      badge_icon: "Star", 
      unlocked: true,
      reward: "100 points"
    },
    { 
      id: 2, 
      title: "Big Spender", 
      description: "Exchange over ₹10,000", 
      badge_icon: "Trophy", 
      unlocked: true,
      reward: "500 points"
    },
    { 
      id: 3, 
      title: "Speed Demon", 
      description: "Complete 3 exchanges in 24h", 
      badge_icon: "Zap", 
      unlocked: false,
      reward: "300 points"
    },
    { 
      id: 4, 
      title: "Secure Pro", 
      description: "Enable all security features", 
      badge_icon: "Shield", 
      unlocked: true,
      reward: "250 points"
    },
    { 
      id: 5, 
      title: "Early Adopter", 
      description: "Join within first 100 users", 
      badge_icon: "Target", 
      unlocked: false,
      reward: "1000 points"
    },
    { 
      id: 6, 
      title: "Verified Master", 
      description: "Complete KYC and add bank account", 
      badge_icon: "Award", 
      unlocked: true,
      reward: "200 points"
    },
  ]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + parseInt(a.reward), 0);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-600" />
            Achievements
          </h1>
          <p className="text-slate-600 font-medium">Unlock badges and earn rewards</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">{unlockedCount}/{achievements.length}</p>
              <p className="text-sm text-slate-600 font-medium">Achievements Unlocked</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">{totalPoints}</p>
              <p className="text-sm text-slate-600 font-medium">Total Points Earned</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
              <p className="text-sm text-slate-600 font-medium">Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievementIcons[achievement.badge_icon] || Trophy;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg'
                    : 'bg-white border-slate-200 shadow-md opacity-60'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : 'bg-slate-200'
                      }`}>
                        <Icon className={`w-8 h-8 ${
                          achievement.unlocked ? 'text-white' : 'text-slate-400'
                        }`} />
                      </div>
                      {achievement.unlocked ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          Unlocked
                        </Badge>
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    
                    <h3 className={`font-bold text-lg mb-2 ${
                      achievement.unlocked ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    
                    <p className={`text-sm mb-3 ${
                      achievement.unlocked ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className={`text-sm font-medium ${
                        achievement.unlocked ? 'text-yellow-600' : 'text-slate-400'
                      }`}>
                        {achievement.reward}
                      </span>
                      {!achievement.unlocked && (
                        <span className="text-xs text-slate-500">Locked</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
