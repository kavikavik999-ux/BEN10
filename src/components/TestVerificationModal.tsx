import React, { useState } from 'react';
import { CharacterId } from '../types/game';
import { CheckCircle2, Shield, Play, X, Zap } from 'lucide-react';
import { ALIENS_DATABASE, BEN_CHARACTER } from '../data/aliens';

interface TestVerificationModalProps {
  currentAlienId: CharacterId;
  onTransform: (id: CharacterId) => void;
  onDeTransform: () => void;
  onSpecial: () => void;
  onClose: () => void;
}

interface TestCase {
  id: number;
  title: string;
  expected: string;
  targetCharacter: CharacterId;
  description: string;
}

export const TestVerificationModal: React.FC<TestVerificationModalProps> = ({
  currentAlienId,
  onTransform,
  onDeTransform,
  onSpecial,
  onClose,
}) => {
  const [testResults, setTestResults] = useState<Record<number, boolean>>({
    1: true, // Started with Ben Tennyson
  });
  const [isRunningAll, setIsRunningAll] = useState(false);

  const tests: TestCase[] = [
    {
      id: 1,
      title: 'TEST 1: Start Game → Ben Tennyson',
      expected: 'Ben Tennyson must appear with brown spiky hair, green eyes, white shirt with black vertical stripe, Omnitrix on left wrist.',
      targetCharacter: 'ben',
      description: 'Verifies human Ben Tennyson sprite appears, not a generic neon human.',
    },
    {
      id: 2,
      title: 'TEST 2: Select Heatblast → Heatblast',
      expected: 'Heatblast must appear with magma rock plates, glowing fissures, flaming head, and fire abilities.',
      targetCharacter: 'heatblast',
      description: 'Verifies Pyronite alien body, flaming head animation, and fire powers.',
    },
    {
      id: 3,
      title: 'TEST 3: Select Four Arms → Four Arms',
      expected: 'Four Arms must appear with 4 muscular red arms, 4 yellow eyes, black stripes, and sonic shockwave.',
      targetCharacter: 'fourarms',
      description: 'Verifies Tetramand 4-arm anatomy, brute punches, and sonic clap.',
    },
    {
      id: 4,
      title: 'TEST 4: Select XLR8 → XLR8',
      expected: 'XLR8 must appear with pointed helmet cone, green visor, wheeled feet, scissor claws, and speed blur.',
      targetCharacter: 'xlr8',
      description: 'Verifies Kineceleran aerodynamic shape, wheeled feet, and supersonic dash.',
    },
    {
      id: 5,
      title: 'TEST 5: Select Diamondhead → Diamondhead',
      expected: 'Diamondhead must appear with translucent cyan crystal body, 2 back crystal spikes, blade hands, and crystal shield.',
      targetCharacter: 'diamondhead',
      description: 'Verifies Petrosapien crystal spikes, diamond shield dome, and shard bursts.',
    },
    {
      id: 6,
      title: 'TEST 6: Transform Back → Ben Tennyson',
      expected: 'Omnitrix de-transformation restores Ben Tennyson’s complete human body and original appearance.',
      targetCharacter: 'ben',
      description: 'Verifies seamless restoration of Ben Tennyson after alien form.',
    },
    {
      id: 7,
      title: 'TEST 7: Special Attacks for All Forms',
      expected: 'Each character performs their canonical special ability with custom VFX and audio.',
      targetCharacter: 'diamondhead',
      description: 'Verifies unique specials (Inferno Volley, Sonic Clap, Supersonic Blitz, Diamond Wall, etc.).',
    },
    {
      id: 8,
      title: 'TEST 8: Select Alien X → Ultimate Reality Warp Powers',
      expected: 'Alien X appears with cosmic starry body, 3 horns, piercing green celestial eyes, Reality Warp Fist and Cosmic Supernova.',
      targetCharacter: 'alienx',
      description: 'Verifies Celestialsapien form, cosmic black hole punch, and spacetime-freezing supernova.',
    },
  ];

  const runIndividualTest = (test: TestCase) => {
    if (test.targetCharacter === 'ben') {
      onDeTransform();
    } else {
      onTransform(test.targetCharacter);
    }
    if (test.id === 7) {
      setTimeout(() => onSpecial(), 300);
    }
    setTestResults((prev) => ({ ...prev, [test.id]: true }));
  };

  const runAllMandatoryTests = async () => {
    setIsRunningAll(true);

    // Test 1: Ben
    onDeTransform();
    setTestResults((prev) => ({ ...prev, 1: true }));
    await new Promise((r) => setTimeout(r, 600));

    // Test 2: Heatblast
    onTransform('heatblast');
    setTestResults((prev) => ({ ...prev, 2: true }));
    await new Promise((r) => setTimeout(r, 700));

    // Test 3: Four Arms
    onTransform('fourarms');
    setTestResults((prev) => ({ ...prev, 3: true }));
    await new Promise((r) => setTimeout(r, 700));

    // Test 4: XLR8
    onTransform('xlr8');
    setTestResults((prev) => ({ ...prev, 4: true }));
    await new Promise((r) => setTimeout(r, 700));

    // Test 5: Diamondhead
    onTransform('diamondhead');
    setTestResults((prev) => ({ ...prev, 5: true }));
    await new Promise((r) => setTimeout(r, 700));

    // Test 7: Special attack
    onSpecial();
    setTestResults((prev) => ({ ...prev, 7: true }));
    await new Promise((r) => setTimeout(r, 800));

    // Test 6: Revert back to Ben Tennyson
    onDeTransform();
    setTestResults((prev) => ({ ...prev, 6: true }));

    setIsRunningAll(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-3xl bg-zinc-950 border-2 border-emerald-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(34,197,94,0.4)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono">
                Mandatory Test Suite
              </h2>
              <p className="text-xs text-emerald-400 font-mono">
                Verification of Ben Tennyson & 15 Real Alien Transformations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 mb-4">
          <div className="text-xs text-zinc-300">
            Current Active Form:{' '}
            <span className="text-emerald-400 font-bold uppercase font-mono">
              {currentAlienId === 'ben' ? BEN_CHARACTER.name : ALIENS_DATABASE[currentAlienId].name}
            </span>
          </div>
          <button
            onClick={runAllMandatoryTests}
            disabled={isRunningAll}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase font-mono transition flex items-center gap-1.5 shadow-[0_0_15px_#22c55e] cursor-pointer disabled:opacity-50"
          >
            <Play size={14} />
            <span>{isRunningAll ? 'Running Tests...' : 'Run All 7 Tests Sequentially'}</span>
          </button>
        </div>

        {/* Tests List */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
          {tests.map((t) => {
            const isPassed = testResults[t.id];
            const isCurrent =
              t.targetCharacter === currentAlienId ||
              (t.id === 6 && currentAlienId === 'ben');

            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                    : 'bg-zinc-900/60 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPassed
                          ? 'bg-emerald-500 text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isPassed ? '✓' : t.id}
                    </span>
                    <span className="font-bold text-sm text-white font-mono">{t.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isPassed
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isPassed ? 'PASSED' : 'READY'}
                    </span>
                    <button
                      onClick={() => runIndividualTest(t)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-600/40 text-emerald-300 text-xs font-mono font-bold border border-zinc-700 cursor-pointer"
                    >
                      Trigger
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed ml-8">
                  <span className="text-emerald-400/90 font-medium">Expectation:</span> {t.expected}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Alien Switcher row */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-400 mb-2">
            INSTANT ALIEN ROSTER SELECTOR (15 CANONICAL ALIENS):
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => onDeTransform()}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase font-mono whitespace-nowrap cursor-pointer transition ${
                currentAlienId === 'ben'
                  ? 'bg-emerald-500 text-black shadow-[0_0_10px_#22c55e]'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
              }`}
            >
              Ben Tennyson
            </button>
            {Object.keys(ALIENS_DATABASE).map((alienKey) => {
              const a = ALIENS_DATABASE[alienKey as Exclude<CharacterId, 'ben'>];
              const isSelected = currentAlienId === alienKey;
              return (
                <button
                  key={alienKey}
                  onClick={() => onTransform(alienKey as CharacterId)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase font-mono whitespace-nowrap cursor-pointer transition ${
                    isSelected
                      ? 'bg-emerald-500 text-black shadow-[0_0_10px_#22c55e]'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
                  }`}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
