import mongoose from 'mongoose';

const research1 = new mongoose.Schema(
  {
    value: {
      type: Number,
    },
    연도: {
      type: String,
    },
  },
  {
    collection: 'research1',
  },
);
const research2 = new mongoose.Schema(
  {
    '체육활동 가능시간 부족': { type: Number },
    '체육 활동에 대한 관심 부족': { type: Number },
    '체육시설 접근성 낮음': { type: Number },
    '동반 참여자 부재': { type: Number },
    '체육활동 지출비용 부담': { type: Number },
    '체육에 소질이 없음': { type: Number },
    '체육활동 정보 부족': { type: Number },
    '소득수준 낮음': { type: Number },
    '건강상의 문제': { type: Number },
    '체육 프로그램 부족': { type: Number },
    연도: { type: String },
  },
  {
    collection: 'research2',
  },
);
const research3 = new mongoose.Schema(
  {
    '건강 유지 및 체력증진': { type: Number },
    '체중조절 및 체형관리': { type: Number },
    '스트레스 해소': { type: Number },
    '여가 선용': { type: Number },
    '개인의 즐거움': { type: Number },
    '대인관계 및 사교': { type: Number },
    연도: { type: String },
  },
  {
    collection: 'research3',
  },
);

interface Research1Type {
  _id: mongoose.Types.ObjectId;
  value: Number;
  연도: String;
}

interface Research2Type {
  _id: mongoose.Types.ObjectId;
  '체육활동 가능시간 부족': Number;
  '체육 활동에 대한 관심 부족': Number;
  '체육시설 접근성 낮음': Number;
  '동반 참여자 부재': Number;
  '체육활동 지출비용 부담': Number;
  '체육에 소질이 없음': Number;
  '체육활동 정보 부족': Number;
  '소득수준 낮음': Number;
  '건강상의 문제': Number;
  '체육 프로그램 부족': Number;
  연도: String;
}

interface Research3Type {
  _id: mongoose.Types.ObjectId;
  '건강 유지 및 체력증진': Number;
  '체중조절 및 체형관리': Number;
  '스트레스 해소': Number;
  '여가 선용': Number;
  '개인의 즐거움': Number;
  '대인관계 및 사교': Number;
  연도: String;
}

export const Research1 = mongoose.model<Research1Type>('research1', research1);
export const Research2 = mongoose.model<Research2Type>('research2', research2);
export const Research3 = mongoose.model<Research3Type>('research3', research3);
