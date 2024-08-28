import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { GeneralLog } from './general-log.entity';
import { success, error } from '../common/helper/result';

describe('LogController', () => {
  let logController: LogController;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogController],
      providers: [
        {
          provide: LogService,
          useValue: {
            addLog: jest.fn(),
            getLogs: jest.fn(),
          },
        },
      ],
    }).compile();

    logController = module.get<LogController>(LogController);
    logService = module.get<LogService>(LogService);
  });

  describe('addLog', () => {
    it('should return success when log is added', async () => {
      const log: GeneralLog = {
        id: 1,
        operation: 'test operation',
        operator: 'test operator',
        platform: 'test platform',
        timestamp: new Date(),
        details: 'test details',
        status: 'test status',
        related_id: 100,
      };

      jest.spyOn(logService, 'addLog').mockResolvedValue(log);  // 返回 GeneralLog 实例

      const response = await logController.addLog(log);

      expect(response).toEqual(success(log));  // 模拟返回成功的结果
      expect(logService.addLog).toHaveBeenCalledWith(log);
    });

    it('should return error when log addition fails', async () => {
      const log: GeneralLog = {
        id: 1,
        operation: 'test operation',
        operator: 'test operator',
        platform: 'test platform',
        timestamp: new Date(),
        details: 'test details',
        status: 'test status',
        related_id: 100,
      };

      const errorMessage = 'Database error';
      jest.spyOn(logService, 'addLog').mockRejectedValue(new Error(errorMessage));

      const response = await logController.addLog(log);

      expect(response).toEqual(error(`Failed to add log: ${errorMessage}`));
    });
  });

  describe('getLogs', () => {
    it('should return logs when queried successfully', async () => {
      const logs: GeneralLog[] = [
        {
          id: 1,
          operation: 'test operation',
          operator: 'test operator',
          platform: 'test platform',
          timestamp: new Date(),
          details: 'test details',
          status: 'test status',
          related_id: 100,
        },
      ];
      const total = 1;

      jest.spyOn(logService, 'getLogs').mockResolvedValue([logs, total]);  // 返回 [GeneralLog[], number]

      const response = await logController.getLogs('test operation', 'test operator', 'test platform', new Date(), new Date(), 'test details', 'test status', 1, 10);

      expect(response).toEqual(success([logs, total]));  // 模拟返回成功的结果
      expect(logService.getLogs).toHaveBeenCalledWith(
        'test operation',
        'test operator',
        'test platform',
        expect.any(Date),
        expect.any(Date),
        'test details',
        'test status',
        1,
        10,
      );
    });

    it('should return error when log query fails', async () => {
      const errorMessage = 'Query failed';
      jest.spyOn(logService, 'getLogs').mockRejectedValue(new Error(errorMessage));

      const response = await logController.getLogs('test operation', 'test operator', 'test platform', new Date(), new Date(), 'test details', 'test status', 1, 10);

      expect(response).toEqual(error(`Failed to query log: ${errorMessage}`));
    });
  });
});
