 
import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerType } from './schema/player.schema';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  const mockPlayer: CreatePlayerDto = {
    firstName: 'Test First Name',
    lastName: 'Test Last Name',
    phone: '+966 55 123 4567',
    email: 'test@example.com',
    type: PlayerType.GOAL_KEEPER,
  };

  const mockPlayerService = {
    create: jest.fn().mockResolvedValue(mockPlayer),
    findOne: jest.fn().mockResolvedValue(mockPlayer),
    update: jest.fn().mockResolvedValue({ ...mockPlayer, firstName: 'Updated Name' }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [{ provide: PlayerService, useValue: mockPlayerService }],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a player', async () => {
    await expect(controller.create(mockPlayer)).resolves.toEqual(mockPlayer);
    expect(service.create).toHaveBeenCalledWith(mockPlayer);
  });

  it('should retrieve a player', async () => {
    await expect(controller.findOne('some-id')).resolves.toEqual(mockPlayer);
    expect(service.findOne).toHaveBeenCalledWith('some-id');
  });

  it('should update a player', async () => {
    await expect(controller.update('some-id', { firstName: 'Updated Name' })).resolves.toEqual({ ...mockPlayer, firstName: 'Updated Name' });
    expect(service.update).toHaveBeenCalledWith('some-id', { firstName: 'Updated Name' });
  });

  it('should delete a player', async () => {
    await expect(controller.remove('some-id')).resolves.toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith('some-id');
  });
});
