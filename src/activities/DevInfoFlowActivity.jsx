/**
 * Backward-compatible entry for principle #1.
 * Prefer DevPrincipleActivity for all principle modules.
 */
import DevPrincipleActivity from './DevPrincipleActivity';

export default function DevInfoFlowActivity(props) {
  return <DevPrincipleActivity {...props} id={props.id ?? 'dev_info_flow'} />;
}
