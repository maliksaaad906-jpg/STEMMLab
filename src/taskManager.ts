import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

const BACKGROUND_TASK_NAME = 'STEMMLAB_BACKGROUND_SYNC';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    console.log('Background task executed successfully');

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log('Background task failed:', error);

    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundTask = async () => {
  if (Platform.OS === 'web') {
    console.log('Background task skipped on web. It works on mobile device.');
    return;
  }

  const status = await BackgroundFetch.getStatusAsync();

  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    console.log('Background task permission denied or restricted');
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 15 * 60,
      stopOnTerminate: false,
      startOnBoot: true,
    });

    console.log('Background task registered successfully');
  } else {
    console.log('Background task already registered');
  }
};