import Head from "next/head";
import {
  Card,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import { Container, styled } from "@mui/system";
import Button from "@mui/material/Button";
import { Novel, StoryData, StoryService } from "@/services/storyService";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
export default function Home() {
  const [novel, setNovel] = React.useState<Novel | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const hasStartedGenerating = useRef(false);

  useEffect(() => {
    // これやらないと、StrictモードでuseEffectが2回呼ばれる(
    if (!hasStartedGenerating.current) {
      hasStartedGenerating.current = true;
    } else {
      return;
    }
    if (novel || isLoading) {
      return;
    }
    setIsLoading(true);
    const loaded = StoryService.loadNovel();
    if (!loaded) {
      router.push("/boarding-report");
    }
    (async () => {
      const result = await StoryService.makeNewDiary(loaded, "");
      setNovel({ ...result });
      setIsLoading(false);
    })();
  }, [novel]);

  const onSubmitAction = async (action: string) => {
    if (!novel) {
      return;
    }
    setIsLoading(true);
    const result = await StoryService.makeNewDiary(novel, action);
    setNovel({ ...result });
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>09:32 火星に向かう</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container sx={{ mt: 5 }}>
        {novel?.stories.map((story, index) => {
          return (
            <StoryComponent
              key={index}
              storyData={story}
              onSubmitAction={onSubmitAction}
            ></StoryComponent>
          );
        })}
        {isLoading && (
          <Paper sx={{ mx: "auto", maxWidth: 600, p: 5, mb: 10 }}>
            <CircularProgress />
            <Typography variant={"subtitle1"}>
              <p>航海中…………。</p>
              <p>
                （日誌の生成に1～2分程度かかるので、コーヒーでも飲みながら少々お待ちください）
              </p>
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
}

const StoryCard = styled(Card)(({}) => ({
  backgroundColor: "#EEEEEE",
}));

const StoryComponent = ({
  storyData,
  onSubmitAction,
}: {
  storyData: StoryData;
  onSubmitAction: (action: string) => void;
}) => {
  const [errorText, setErrorText] = React.useState("");
  const [action, setAction] = React.useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    setAction(event.target.value);
  };
  const onButtonClick = () => {
    if (!action || action.length > 40) {
      setErrorText("行動を40文字以内で入力してください。");
      return;
    }
    onSubmitAction(action);
  };
  return (
    <>
      <Paper sx={{ mx: "auto", maxWidth: 600, p: 5, mb: 10 }} elevation={3}>
        <Grid container>
          <Grid xs={12} sx={{ mb: 5 }}>
            <Typography variant={"h4"}>{storyData.day}日目</Typography>
          </Grid>
          <Grid xs={12}>
            <StoryCard variant="outlined" sx={{ px: 2 }}>
              <Typography variant={"subtitle1"}>
                <p>{storyData.description}</p>
              </Typography>
            </StoryCard>
          </Grid>
          {storyData.day === 5 && (
            <Grid xs={12} sx={{ mb: 5 }}>
              <Link href="/boarding-report">
                <Button color="primary" variant="outlined">
                  次の航海へ
                </Button>
              </Link>
            </Grid>
          )}
          {storyData.day <= 4 && !storyData.action && (
            <Grid xs={12} sx={{ mb: 5 }}>
              <Typography variant={"subtitle1"}>
                <p>次の日、あなたは…………</p>
              </Typography>
              <TextField
                sx={{ mb: 5 }}
                error={!!errorText}
                required
                fullWidth
                name="characterName"
                label="次の日の行動を入力しよう"
                variant="outlined"
                multiline
                rows={4}
                value={action}
                helperText={errorText}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {action.length}/40
                    </InputAdornment>
                  ),
                  inputProps: {
                    maxLength: 40,
                  },
                }}
              />
              <Grid xs={12}>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={onButtonClick}
                >
                  次の日へ
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
};
