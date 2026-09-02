import { describe, expect, it } from 'vitest';
import { SHOWCASE_ACTIVITIES } from './showcaseActivities';

describe('showcase source inventory', () => {
  it('maps every external showcase app to a source repository', () => {
    const externalActivities = SHOWCASE_ACTIVITIES.filter((activity) => activity.url);

    expect(externalActivities).not.toHaveLength(0);
    expect(externalActivities.every((activity) => activity.repoUrl?.startsWith('https://github.com/Reasonofmoon/'))).toBe(true);
  });

  it('maps every alternate deployment to its source repository', () => {
    const alternateDeployments = SHOWCASE_ACTIVITIES.flatMap((activity) => activity.extraLinks ?? []);

    expect(alternateDeployments).not.toHaveLength(0);
    expect(alternateDeployments.every((deployment) => deployment.repoUrl?.startsWith('https://github.com/Reasonofmoon/'))).toBe(true);
  });
});
