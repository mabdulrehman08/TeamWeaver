import CompareMessagesPanel from "../components/comparison/CompareMessagesPanel";
import { useComparison } from "../hooks/useComparison";

export function CompareMessages() {
  const comparison = useComparison();
  return <CompareMessagesPanel {...comparison} />;
}

export default CompareMessages;
