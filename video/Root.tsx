import CodeTransitionCompositionLoader from "./compositions/code-transition-with-loader";
import NewDynamicCompositionWithLoader from "./compositions/composition-with-loader";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <CodeTransitionCompositionLoader />
      <NewDynamicCompositionWithLoader />
    </>
  );
};
