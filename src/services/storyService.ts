import { v4 } from "uuid";
import { ChatGptService } from "@/services/chatGptService";

export type StoryData = {
  day: number;
  description: string;
  action: string;
  summaryOfWholeStory: string;
};
export type Novel = {
  storyKey: string;
  heroName: string;
  stories: StoryData[];
};

/**
 * 新しいNovelを作る
 */
const newNovel = (heroName: string): Novel => {
  return {
    heroName,
    storyKey: v4(),
    stories: [],
  };
};
/**
 * Novelを保存する
 * @param novel
 */
const saveNovel = (novel: Novel) => {
  try {
    sessionStorage.setItem("story", JSON.stringify(novel));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

/**
 * Novelをロードする
 */
const loadNovel = (): Novel => {
  try {
    const fileData = sessionStorage.getItem("story");
    if (!fileData) {
      throw Error("No files found");
    }
    const obj = JSON.parse(fileData);
    if (!isNovel(obj)) {
      throw Error("Invalid data format");
    }

    return obj;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

/**
 * 要約を作成するためのPromptを生成する
 * @param day
 * @param novel
 */
const createSummaryPrompt = (day: number, novel: Novel): string => {
  switch (day) {
    case 0:
      return `【200文字以内の要約】以下の物語を要約せよ。それとは別にキャラクターの名前と行動を合計100字で記載せよ。\n${novel.stories[day].description}`;
    case 1:
      return `【200文字以内の要約】以下の物語を要約せよ。それとは別にキャラクターの名前と行動を合計100字で記載せよ。\n過去のまとめ：${
        novel.stories[day - 1].summaryOfWholeStory
      }\n今日の出来事：${novel.stories[day].description}
      以下の形式で記載せよ。
      【過去のまとめ】：
      【今日のまとめ】`;
    case 2:
      return `【200文字以内の要約】以下の物語を要約せよ。重要な出来事は省略できない。それとは別にキャラクターの名前と行動を合計100字で記載せよ。\n過去のまとめ：${
        novel.stories[day - 1].summaryOfWholeStory
      }\n今日の出来事：${novel.stories[day].description}
      以下の形式で記載せよ。
      【過去のまとめ】：
      【今日のまとめ】`;
    case 3:
      return `【200文字以内の要約】以下の物語を要約せよ。重要な出来事は省略できない。それとは別にキャラクターの名前と行動を合計100字で記載せよ。\n過去のまとめ：${
        novel.stories[day - 1].summaryOfWholeStory
      }\n今日の出来事：${novel.stories[day].description}
      以下の形式で記載せよ。
      【過去のまとめ】：
      【今日のまとめ】`;
    case 4:
      return `【200文字以内の要約】以下の物語を要約せよ。重要な出来事は省略できない。それとは別にキャラクターの名前と行動を合計100字で記載せよ。\n過去のまとめ：${
        novel.stories[day - 1].summaryOfWholeStory
      }\n今日の出来事：${novel.stories[day].description}
      以下の形式で記載せよ。
      【過去のまとめ】：
      【今日のまとめ】`;
  }
  throw Error("Invalid Day");
};

/**
 * ストーリーを作るためのpromptを作成する
 * @param currentDay 現在日
 * @param heroName 主人公の名前
 * @param prevSummary 過去の物語の要約
 * @param action 次の日に主人公がとる行動
 */
const createStoryPrompt = (
  currentDay: number,
  heroName: string,
  prevSummary?: string,
  action?: string
) => {
  switch (currentDay) {
    case 0:
      return `【300文字以内の小説】地球から火星への5日間の航海の物語を作れ。まずは1日目のストーリーを書け。登場人物は4人でその中には${heroName}を含めよ。私「${heroName}」は
      主人公であり物語の主役である。朝起きてから夜寝るまでの出来事を書け、その中でちょっとした事件を起こせ。
      制約：ストーリーは主人公の一人称目線で「ですます」ではなく「である調」＋「過去形」で書け。小説なので文中に文字数は書いてはならない。最大文字数は200を超えてはならない。
      推奨：乗組員の名前や行動は文中に積極的に書け。
      
      1日目：`;
    case 1:
      return `【300文字以内の小説】地球から火星への5日間の航海の物語を作っている。登場人物は4人で、私「${heroName}」は
      主人公であり物語の主役である。朝起きてから夜寝るまでの出来事を書け、2日目は奇抜でかつやや大きな事件を起こせ。
      制約：ストーリーは主人公の一人称目線で「ですます」ではなく「である調」＋「過去形」で書け。小説なので文中に文字数は書いてはならない。最大文字数は200を超えてはならない。
      ${heroName}は次の行動を取るので、その結果を物語に含めよ。 
      行動：${action}
      推奨：乗組員の名前や行動は文中に積極的に書け。
      ヒント：前日までの出来事のまとめは以下である。\n前日までの出来事のまとめは以下である。\n
${prevSummary}\nそして${heroName}は以下の行動を取った。\n${action}\n
      2日目：`;
    case 2:
      return `【300文字以内の小説】地球から火星への5日間の航海の物語を作っている。登場人物は4人で私「${heroName}」は
      主人公であり物語の主役である。朝起きてから夜寝るまでの出来事を書け、これは3日目である。重大な事件を起こせ。
      制約：ストーリーは主人公の一人称目線で「ですます」ではなく「である調」＋「過去形」で書け。小説なので文中に文字数は書いてはならない。
      ${heroName}は次の行動を取るので、その結果を物語に含めよ。 
      行動：${action}
      推奨：乗組員の名前や行動は文中に積極的に書け。
      ヒント：前日までの出来事のまとめは以下である。\n
${prevSummary}\nそして${heroName}は以下の行動を取った。\n${action}。\n
       3日目：`;
    case 3:
      return `【300文字以内の小説】地球から火星への5日間の航海の物語を作っている。登場人物は4人で私「${heroName}」は
      主人公であり物語の主役である。朝起きてから夜寝るまでの出来事を書け、これは4日目である。5日目がエンディングであるから4日目に問題を解決してはいけない。主人公に大きな決断を促せ。
      制約：ストーリーは主人公の一人称目線で「ですます」ではなく「である調」＋「過去形」で書け。小説なので文中に文字数は書いてはならない。
      ${heroName}は次の行動を取るので、その結果を物語に含めよ。 
      行動：${action}
      推奨：乗組員の名前や行動は文中に積極的に書け。
      ヒント：前日までの出来事のまとめは以下である。\n前日までの出来事のまとめは以下である。\n
${prevSummary}\nそして${heroName}は以下の行動を取った。\n${action}\n
       4日目：`;
    case 4:
      return `【300文字以内の小説】地球から火星への5日間の航海の物語を作っている。登場人物は4人で私「${heroName}」は
      主人公であり物語の主役である。朝起きてから夜寝るまでの出来事を書け、最後の日なのでミッションの成功または失敗のいずれかの結果を記載し、物語を完結させよ。
      制約：ストーリーは主人公の一人称目線で「ですます」ではなく「である調」＋「過去形」で書け。小説なので文中に文字数は書いてはならない。
      ${heroName}は次の行動を取るので、その結果を物語に含めよ。 
      行動：${action}
      推奨：乗組員の名前や行動は文中に積極的に書け。
      ヒント：前日までの出来事のまとめは以下である。\n前日までの出来事のまとめは以下である。\n
${prevSummary}\nそして${heroName}は以下の行動を取った。\n${action}\
      5日目：`;
  }
};
/**
 * 新しい日誌を作成する。
 * @param prevNovel
 * @param newAction
 */
const makeNewDiary = async (
  prevNovel: Novel,
  newAction: string
): Promise<Novel> => {
  // 日付を判定
  const currentDay = prevNovel.stories.length;

  // 昨日の日記に行動を入れる
  if (currentDay !== 0) {
    prevNovel.stories[currentDay - 1].action = newAction;
  }

  // 新しい日記を作成
  const newStoryPrompt = createStoryPrompt(
    currentDay,
    prevNovel.heroName,
    currentDay === 0
      ? ""
      : prevNovel.stories[currentDay - 1].summaryOfWholeStory,
    newAction
  );
  if (!newStoryPrompt) {
    throw Error("No prompt generated.");
  }
  const newDayStory = (
    await ChatGptService.creatCompletion(newStoryPrompt)
  ).join("\n");
  const newNovel = {
    ...prevNovel,
    stories: prevNovel.stories.concat({
      day: prevNovel.stories.length + 1,
      description: newDayStory,
      action: "",
      summaryOfWholeStory: "",
    }),
  };
  // サマリーを作成
  const summaryPrompt = createSummaryPrompt(currentDay, newNovel);
  const storyData = newNovel.stories[newNovel.stories.length - 1];
  newNovel.stories[newNovel.stories.length - 1] = {
    ...storyData,
    summaryOfWholeStory: (
      await ChatGptService.creatCompletion(summaryPrompt)
    ).join("\n"),
    action: "",
  };
  return newNovel;
};

/**
 * Novel型かどうか判定する
 * @param src
 */
const isNovel = (src: object): src is Novel => {
  if ("heroName" in src && "stories" in src) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return src.stories.every((story) => {
      return (
        "day" in story &&
        "description" in story &&
        "action" in story &&
        "summaryOfWholeStory" in story
      );
    });
  }
  return false;
};

export const StoryService = {
  newNovel,
  makeNewDiary,
  saveNovel,
  loadNovel,
};
