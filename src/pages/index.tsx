import Head from "next/head";
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import { Container } from "@mui/system";
import Button from "@mui/material/Button";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <Head>
        <title>09:32 火星に向かう</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container sx={{ mt: 5 }}>
        <Paper sx={{ mx: "auto", maxWidth: 600, p: 5 }}>
          <Grid container>
            <Grid xs={12}>
              <Typography variant={"h3"}>09:32 火星に向かう</Typography>
            </Grid>
            <Grid xs={12}>
              <Typography variant={"subtitle1"}>
                <p>
                  ChatGPTと対話をしながら、地球から火星に向かう5日間の物語を紡ぎましょう。
                </p>
              </Typography>
              <Typography variant={"subtitle1"}>
                <p>
                  あなたはChatGPTが提示する1日の出来事を読んで次の日の行動を決めることができます。
                </p>
              </Typography>
              <Typography variant={"subtitle1"}>
                <p>
                  勇敢な船長、天才科学者、または冷静な技術者か、あるいは他の役割を演じることになるのか。
                </p>
                <p>
                  あなたの物語の選択は、宇宙船内での人間関係やミッションの成否に大きな影響を与えるでしょう。
                </p>
              </Typography>
              <Typography variant={"subtitle1"}>
                <p>さあ、そろそろ出航の時刻が近付いてきたようです。</p>
              </Typography>
              <Link href="/boarding-report">
                <Button color="primary" variant="outlined">
                  出航する
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
